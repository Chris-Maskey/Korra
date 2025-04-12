"use server";

import { createClient } from "@/lib/supabase/server";
import { locationSchema } from "../../schema";

export const createLocation = async (
  data: (typeof locationSchema)["_output"],
) => {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    throw new Error(authError.message);
  }

  if (!user) {
    throw new Error("User not found");
  }

  const formData = {
    ...data,
    user_id: user.id,
  };

  const { error } = await supabase.from("locations").insert(formData);

  if (error) {
    throw new Error(error.message);
  }
};

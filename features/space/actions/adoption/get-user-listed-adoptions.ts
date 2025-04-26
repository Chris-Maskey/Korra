"use server";

import { createClient } from "@/lib/supabase/server";

export const getUserListedAdoptions = async () => {
  const supabase = await createClient();

  const { data: user, error: authError } = await supabase.auth.getUser();

  if (!user || authError) {
    throw new Error("You must be logged in to view your listed adoptions");
  }

  const { data: listedAdoptions, error } = await supabase
    .from("adoption")
    .select("*")
    .eq("user_id", user.user.id);

  if (error) {
    throw new Error(error.message);
  }

  return listedAdoptions;
};

"use server";

import { createClient } from "@/lib/supabase/server";
import { signUpSchema } from "../schema";

export const signUp = async (values: (typeof signUpSchema)["_output"]) => {
  const supabase = await createClient();
  const { firstName, lastName, username, email, password } = values;

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: `${firstName} ${lastName}`,
        user_name: username,
      },
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  return { message: "Please verify your email" };
};

"use server";

import { createClient } from "@/lib/supabase/server";
import { signInSchema } from "../schema";

export const signIn = async (data: (typeof signInSchema)["_output"]) => {
  try {
    const supabase = await createClient();

    const { email, password } = data;

    const user = await supabase.auth.getUser();
    if (user.data.user) {
      return { message: "You are already signed in" };
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    return { message: "Sign-In Successful" };
  } catch (error: any) {
    console.error("Sign-In Error:", error.message);
    return { message: error.message || "An unexpected error occurred" };
  }
};

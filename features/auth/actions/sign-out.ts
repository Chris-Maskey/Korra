"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const signOut = async () => {
  try {
    const supabase = await createClient();

    const { error } = await supabase.auth.signOut();

    if (error) {
      throw new Error(error.message);
    }

    return { message: "Sign-Out Successful" };
  } catch (error: any) {
    console.error("Sign-Out Error:", error.message);
    return { message: error.message || "An unexpected error occurred" };
  }
};

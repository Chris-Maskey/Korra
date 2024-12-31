"use server";

import { createClient } from "@/lib/supabase/server";
import { signInSchema } from "../schema";
import { redirect } from "next/navigation";

export const signIn = async (data: (typeof signInSchema)["_output"]) => {
  const supabase = await createClient();

  const { email, password } = data;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return redirect("/space");
};

"use server";

import { createClient } from "@/lib/supabase/server";
import { Provider } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

export const signInWithOAuth = async (provider: Provider) => {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_URL}/auth/callback`,
    },
  });

  if (error) {
    console.error("OAuth Sign-In Error:", error.message);
  }

  if (data.url) {
    redirect(data.url); // use the redirect API for your server framework
  }
};

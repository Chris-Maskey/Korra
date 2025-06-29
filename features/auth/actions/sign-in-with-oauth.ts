"use server";

import { createClient } from "@/lib/supabase/server";
import { Provider } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

export async function signInWithOAuth(provider: Provider) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${
        process.env.NEXT_PUBLIC_VERCEL_URL ?? "http://localhost:3000"
      }/auth/callback`,
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  return redirect(data.url);
}

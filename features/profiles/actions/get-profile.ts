"use server";

import { createClient } from "@/lib/supabase/server";

export const getProfile = async ({ userId }: { userId: string }) => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("*", { count: "exact" })
    .eq("id", userId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

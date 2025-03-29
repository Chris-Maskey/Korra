"use server";

import { createClient } from "@/lib/supabase/server";

export const getPostCount = async (userId: string) => {
  const supabase = await createClient();
  const { count } = await supabase
    .from("posts")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);
  return count;
};

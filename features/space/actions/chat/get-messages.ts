"use server";

import { createClient } from "@/lib/supabase/server";

export const getMessages = async (recepientId: string) => {
  const supabase = await createClient();

  const { data: user, error: authError } = await supabase.auth.getUser();

  if (!user || authError) {
    throw new Error(authError?.message);
  }

  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .or(
      `and(sender_id.eq.${user.user.id},recipient_id.eq.${recepientId}),` +
        `and(sender_id.eq.${recepientId},recipient_id.eq.${user.user.id})`,
    )
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

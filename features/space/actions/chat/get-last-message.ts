"use server";

import { createClient } from "@/lib/supabase/server";

export const getLatestMessage = async (recipientId: string) => {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (!user || authError) {
    throw new Error(authError?.message);
  }

  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .or(
      `and(sender_id.eq.${user.id},recipient_id.eq.${recipientId}),` +
        `and(sender_id.eq.${recipientId},recipient_id.eq.${user.id})`,
    )
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  return error ? null : data;
};

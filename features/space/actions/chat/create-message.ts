"use server";

import { createClient } from "@/lib/supabase/server";
import { messageSchema } from "../../schema";

export const createMessage = async (
  data: (typeof messageSchema)["_output"],
  recepientId: string,
) => {
  const supabase = await createClient();

  const { data: user, error: authError } = await supabase.auth.getUser();

  if (!user || authError) {
    throw new Error("You must be logged in to send a message");
  }

  const { content, attachment } = data;

  let attachmentUrl: string | null = null;

  if (attachment) {
    const fileName = `${user.user.id}/${crypto.randomUUID()}-${attachment.name}`;

    const { error: uploadError } = await supabase.storage
      .from("posts")
      .upload(fileName, attachment);

    if (uploadError) {
      throw new Error("Failed to upload image: " + uploadError.message);
    }

    const { data: urlData } = supabase.storage
      .from("posts")
      .getPublicUrl(fileName);

    attachmentUrl = urlData.publicUrl;
  }

  const { error } = await supabase.from("messages").insert({
    content,
    sender_id: user.user.id,
    attachment_url: attachmentUrl,
    recipient_id: recepientId,
  });

  if (error) {
    throw new Error(error.message);
  }
};

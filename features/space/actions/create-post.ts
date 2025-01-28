"use server";

import { createClient } from "@/lib/supabase/server";
import { postSchema } from "../schema";

export const createPost = async (
  data: (typeof postSchema)["_output"],
): Promise<void> => {
  const supabase = await createClient();

  const { data: user, error: authError } = await supabase.auth.getUser();

  if (!user || authError) {
    throw new Error("You must be logged in to create a post");
  }

  let imageUrl: string | null = null;

  if (data.image) {
    const file = data.image;

    const fileName = `${user.user.id}/${crypto.randomUUID()}-${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from("posts")
      .upload(fileName, file);

    if (uploadError) {
      throw new Error("Failed to upload image: " + uploadError.message);
    }

    const { data: urlData } = supabase.storage
      .from("posts")
      .getPublicUrl(fileName);

    imageUrl = urlData.publicUrl;
  }

  const { data: postData, error: postError } = await supabase
    .from("posts")
    .insert({
      user_id: user.user.id,
      content: data.content,
      image_url: imageUrl,
    })
    .select()
    .single();

  if (postError) {
    throw new Error("Failed to create post: " + postError.message);
  }

  return postData;
};

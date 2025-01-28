"use server";

import { createClient } from "@/lib/supabase/server";

export const getPosts = async () => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("posts")
    .select(
      `
      id,
      content,
      image_url,
      created_at,
      profiles:user_id(full_name, avatar_url),
      likes:likes(count),
      comments:comments(
        id,
        content,
        created_at,
        profiles:user_id(full_name, avatar_url)
      )
    `,
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  console.log(data);

  return data;
};

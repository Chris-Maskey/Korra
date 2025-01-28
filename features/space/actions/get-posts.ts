"use server";

import { createClient } from "@/lib/supabase/server";
import { QueryData } from "@supabase/supabase-js";

export const getPosts = async () => {
  const supabase = await createClient();

  const postQuery = supabase
    .from("posts")
    .select(
      `
      id,
      content,
      image_url,
      created_at,
      profiles:profiles(full_name, avatar_url),
      likes:likes(count),
      comments:comments(
        id,
        content,
        created_at,
        profiles:profiles(full_name, avatar_url)
      )
    `,
    )
    .order("created_at", { ascending: false });

  const { data, error } = await postQuery;

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

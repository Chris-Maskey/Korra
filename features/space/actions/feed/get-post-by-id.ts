"use server";

import { createClient } from "@/lib/supabase/server";

export const getPostById = async (postId: string) => {
  const supabase = await createClient();

  const { data: user, error: authError } = await supabase.auth.getUser();

  if (!user || authError) {
    throw new Error("Please log in to view this post");
  }

  const { data: post, error: postError } = await supabase
    .from("posts")
    .select("*")
    .eq("id", postId)
    .single();

  if (postError || !post) {
    throw new Error("Post not found");
  }

  return post;
};

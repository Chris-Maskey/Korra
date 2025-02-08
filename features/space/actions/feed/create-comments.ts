"use server";

import { createClient } from "@/lib/supabase/server";
import { commentSchema } from "../../schema";

export const createComment = async (
  postId: string,
  data: (typeof commentSchema)["_output"],
) => {
  const supabase = await createClient();

  if (!postId) {
    throw new Error("Post ID is required");
  }

  if (!data.content) {
    throw new Error("Content is required");
  }

  const { data: post, error: postError } = await supabase
    .from("posts")
    .select("*")
    .eq("id", postId)
    .single();

  if (postError || !post) {
    throw new Error("Post not found");
  }

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (!user || authError) {
    throw new Error(
      "Authentication Error: You must be logged in to create a comment",
    );
  }

  const { error: commentError } = await supabase.from("comments").insert({
    content: data.content,
    post_id: postId,
    user_id: user.id,
  });

  if (commentError) {
    throw new Error("Failed to create comment: " + commentError.message);
  }
};

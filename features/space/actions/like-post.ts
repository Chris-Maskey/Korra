"use server";

import { createClient } from "@/lib/supabase/server";

type PostLikeResponse = {
  success: boolean;
  isLiked: boolean;
  error?: string;
};

export const likePost = async (postId: string): Promise<PostLikeResponse> => {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) throw new Error("Authentication required");

    // Check if post exists
    const { data: post, error: postError } = await supabase
      .from("posts")
      .select("id")
      .eq("id", postId)
      .single();

    if (postError || !post) {
      return {
        success: false,
        isLiked: false,
        error: "Post not found",
      };
    }

    const { data: existingLike, error: existingLikeError } = await supabase
      .from("likes")
      .select()
      .match({
        post_id: postId,
        user_id: user.id,
      })
      .single();

    if (existingLikeError && existingLikeError.code !== "PGRST116") {
      // PGRST116 is the "not found" error code
      return {
        success: false,
        isLiked: false,
        error: "Failed to check like status",
      };
    }

    // If post is already liked, unlike it
    if (existingLike) {
      const { error: unlikeError } = await supabase
        .from("likes")
        .delete()
        .match({ post_id: postId, user_id: user.id });

      if (unlikeError) {
        return {
          success: false,
          isLiked: true,
          error: "Failed to unlike post",
        };
      }

      return {
        success: true,
        isLiked: false,
      };
    }

    // If post is not liked, like it
    const { error: likeError } = await supabase.from("likes").insert({
      post_id: postId,
      user_id: user.id,
    });

    if (likeError) {
      return {
        success: false,
        isLiked: false,
        error: `Failed to like post: ${likeError.message}`,
      };
    }

    return {
      success: true,
      isLiked: true,
    };
  } catch (error) {
    return {
      success: false,
      isLiked: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
};

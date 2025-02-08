"use server";
import { createClient } from "@/lib/supabase/server";

type PostLikeResponse = {
  postId: string;
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

    // Check for existing like using maybeSingle for better error handling
    const { data: existingLike, error: existingLikeError } = await supabase
      .from("likes")
      .select()
      .match({ post_id: postId, user_id: user.id })
      .maybeSingle();

    if (existingLikeError) {
      return {
        postId,
        success: false,
        isLiked: false,
        error: "Failed to check like status",
      };
    }

    if (existingLike) {
      const { error: deleteError } = await supabase
        .from("likes")
        .delete()
        .match({ post_id: postId, user_id: user.id });

      if (deleteError) throw deleteError;
      return { postId, success: true, isLiked: false };
    }

    const { error: insertError } = await supabase
      .from("likes")
      .insert({ post_id: postId, user_id: user.id });

    if (insertError) throw insertError;
    return { postId, success: true, isLiked: true };
  } catch (error) {
    return {
      postId,
      success: false,
      isLiked: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
};

"use server";

import { createClient } from "@/lib/supabase/server";

export const deletePost = async (postId: string): Promise<boolean> => {
  const supabase = await createClient();

  try {
    // Authenticate user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) throw new Error("Authentication required");

    // Fetch post with ownership verification
    const { data: post, error: fetchError } = await supabase
      .from("posts")
      .select("image_url")
      .match({ id: postId, user_id: user.id })
      .single();

    if (fetchError) throw new Error("Post not found or access denied");

    // Delete associated image if exists
    if (post.image_url) {
      const urlParts = post.image_url.split("/storage/v1/object/public/");
      if (urlParts.length < 2) throw new Error("Invalid image URL format");

      const [bucket, ...filePath] = urlParts[1].split("/");
      const filePathStr = filePath.join("/");

      const { error: storageError } = await supabase.storage
        .from(bucket)
        .remove([filePathStr]);

      if (storageError) {
        throw new Error(`Image deletion failed: ${storageError.message}`);
      }
    }

    // Delete post record
    const { error: deleteError } = await supabase
      .from("posts")
      .delete()
      .match({ id: postId, user_id: user.id });

    if (deleteError)
      throw new Error(`Post deletion failed: ${deleteError.message}`);

    return true;
  } catch (error) {
    console.error("Deletion error:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "An unexpected error occurred during deletion",
    );
  }
};

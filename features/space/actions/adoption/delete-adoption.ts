"use server";

import { createClient } from "@/lib/supabase/server";

export const deleteAdoptionPost = async (adoptionPostId: string) => {
  const supabase = await createClient();

  const { data: user, error: authError } = await supabase.auth.getUser();

  if (!user || authError) {
    throw new Error("You must be logged in to delete a adoption post");
  }

  const { error } = await supabase
    .from("adoption")
    .delete()
    .eq("id", adoptionPostId);

  if (error) {
    throw new Error("Failed to delete adoption post: " + error.message);
  }
};

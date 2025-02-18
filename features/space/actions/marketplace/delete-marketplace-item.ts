"use server";

import { createClient } from "@/lib/supabase/server";

export const deleteMarketplaceItem = async (marketplacePostId: string) => {
  const supabase = await createClient();

  const { data: user, error: authError } = await supabase.auth.getUser();

  if (!user || authError) {
    throw new Error("You must be logged in to delete a adoption post");
  }

  const { error } = await supabase
    .from("marketplace")
    .delete()
    .eq("id", marketplacePostId);

  if (error) {
    throw new Error("Failed to delete marketplace item: " + error.message);
  }
};

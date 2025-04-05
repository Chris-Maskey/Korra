"use server";

import { revalidatePath } from "next/cache";
import type { CreateReviewInput, Review } from "@/features/space/types";
import { createClient } from "@/lib/supabase/server";

// Create a new review
export async function createReview(
  input: CreateReviewInput,
): Promise<{ success: boolean; data?: Review; error?: string }> {
  try {
    const supabase = await createClient();

    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    // Check if user has already reviewed this item
    const { data: existingReview, error: checkError } = await supabase
      .from("reviews")
      .select("id")
      .eq("user_id", user.id)
      .eq("item_id", input.item_id)
      .maybeSingle();

    if (checkError) {
      throw new Error(checkError.message);
    }

    if (existingReview) {
      return { success: false, error: "You have already reviewed this item" };
    }

    // Check if user has purchased the item
    const { data: purchasedOrders, error: purchaseCheckError } = await supabase
      .from("orders")
      .select("id")
      .eq("user_id", user.id)
      .eq("item_id", input.item_id);

    if (purchaseCheckError) {
      throw new Error(purchaseCheckError.message);
    }

    // Optional: Require purchase to review
    if (!purchasedOrders || purchasedOrders.length === 0) {
      return {
        success: false,
        error: "You must purchase this item before reviewing it",
      };
    }

    // Use the first order ID if order_id wasn't provided
    const orderId =
      input.order_id ||
      (purchasedOrders.length > 0 ? purchasedOrders[0].id : null);

    // Create the review
    const { data: review, error: reviewError } = await supabase
      .from("reviews")
      .insert({
        user_id: user.id,
        item_id: input.item_id,
        order_id: orderId,
        rating: input.rating,
        title: input.title || "", // Handle nullable fields
        content: input.content || "", // Handle nullable fields
      })
      .select()
      .single();

    if (reviewError) {
      throw new Error(reviewError.message);
    }

    revalidatePath(`/space/marketplace/${input.item_id}`);

    return { success: true, data: review as Review };
  } catch (error) {
    console.error("Error creating review:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create review",
    };
  }
}

export async function getItemReviews(
  itemId: string,
): Promise<{ success: boolean; data?: Review[]; error?: string }> {
  try {
    const supabase = await createClient();

    // Get reviews for the item
    const { data: reviews, error: reviewsError } = await supabase
      .from("reviews")
      .select(
        `
        *,
        user:profiles(
          id,
          full_name,
          avatar_url
        )
      `,
      )
      .eq("item_id", itemId)
      .order("created_at", { ascending: false });

    if (reviewsError) {
      throw new Error(reviewsError.message);
    }

    return { success: true, data: reviews as Review[] };
  } catch (error) {
    console.error("Error fetching item reviews:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch reviews",
    };
  }
}

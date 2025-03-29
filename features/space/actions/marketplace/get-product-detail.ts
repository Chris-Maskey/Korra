"use server";

import { createClient } from "@/lib/supabase/server";

export const getProductDetail = async (itemId: string) => {
  const supabase = await createClient();

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data: item, error: itemError } = await supabase
      .from("marketplace")
      .select(
        `
        *,
        user:profiles(
          id,
          full_name,
          avatar_url,
          created_at
        )
      `,
      )
      .eq("id", itemId)
      .single();

    if (itemError) {
      throw new Error(itemError.message);
    }

    // Fetch rating statistics
    const { data: ratingStats, error: ratingError } = await supabase.rpc(
      "get_item_rating_distribution",
      { item_id_param: itemId },
    );

    if (ratingError) {
      console.error("Error fetching rating distribution:", ratingError);
    }

    // Fetch reviews
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
      console.error("Error fetching reviews:", reviewsError);
    }

    // If user is logged in, check if they've reviewed this item
    let userReview = null;
    let userHasPurchased = false;

    if (user) {
      // Check if user has already reviewed this item
      const { data: existingReview, error: reviewCheckError } = await supabase
        .from("reviews")
        .select("*")
        .eq("user_id", user.id)
        .eq("item_id", itemId)
        .maybeSingle();

      if (!reviewCheckError) {
        userReview = existingReview;
      }

      // Check if user has purchased this item
      const { data: hasPurchased, error: purchaseCheckError } =
        await supabase.rpc("has_user_purchased_item", {
          user_id_param: user.id,
          item_id_param: itemId,
        });

      if (!purchaseCheckError) {
        userHasPurchased = hasPurchased;
      }
    }

    // Fetch seller statistics
    const { data: sellerStats, error: sellerStatsError } = await supabase.rpc(
      "get_seller_statistics",
      { seller_id_param: item.user_id },
    );

    if (sellerStatsError) {
      console.error("Error fetching seller statistics:", sellerStatsError);
    }

    // Compile all data
    return {
      product: item,
      reviews: reviews || [],
      reviewsCount: reviews?.length || 0,
      ratingDistribution: ratingStats || [],
      sellerStats: sellerStats || null,
      userReview,
      userHasPurchased,
      userContext: user
        ? {
            id: user.id,
            isAuthenticated: true,
          }
        : {
            isAuthenticated: false,
          },
    };
  } catch (error) {
    console.error("Error fetching product details:", error);
    throw error;
  }
};

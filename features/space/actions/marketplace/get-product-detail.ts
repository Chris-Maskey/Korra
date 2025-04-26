"use server";

import { createClient } from "@/lib/supabase/server";

// Helper function to calculate rating distribution with proper TypeScript types
type Review = {
  rating: 1 | 2 | 3 | 4 | 5;
  //eslint-disable-next-line
  [key: string]: any;
};

type RatingDistribution = {
  rating_value: 1 | 2 | 3 | 4 | 5;
  count: number;
  percentage: number;
};

export const getProductDetail = async (itemId: string) => {
  const supabase = await createClient();

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Fetch the product details
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

    // Calculate rating distribution manually since we might not have the RPC function
    const ratingDistribution = calculateRatingDistribution(
      (reviews as Review[]) || [],
    );

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
      const { data: purchasedOrders, error: purchaseCheckError } =
        await supabase
          .from("orders")
          .select("*")
          .eq("user_id", user.id)
          .eq("item_id", itemId);

      if (
        !purchaseCheckError &&
        purchasedOrders &&
        purchasedOrders.length > 0
      ) {
        userHasPurchased = true;
      }
    }

    // Compile all data
    return {
      product: item,
      reviews: reviews || [],
      reviewsCount: reviews?.length || 0,
      averageRating: getAverageRatingFromDistribution(ratingDistribution),
      ratingDistribution: ratingDistribution,
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

function calculateRatingDistribution(reviews: Review[]): RatingDistribution[] {
  const distribution: RatingDistribution[] = [];
  const counts: Record<1 | 2 | 3 | 4 | 5, number> = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };
  const totalCount = reviews.length;

  // Count ratings
  reviews.forEach((review) => {
    // Ensure the rating is within valid range (1-5)
    const rating = review.rating;
    if (rating >= 1 && rating <= 5) {
      counts[rating as 1 | 2 | 3 | 4 | 5] += 1;
    }
  });

  // Calculate percentages and format
  for (let i = 5; i >= 1; i--) {
    const ratingValue = i as 1 | 2 | 3 | 4 | 5;
    distribution.push({
      rating_value: ratingValue,
      count: counts[ratingValue],
      percentage:
        totalCount > 0
          ? Math.round((counts[ratingValue] / totalCount) * 100 * 100) / 100
          : 0,
    });
  }

  return distribution;
}

function getAverageRatingFromDistribution(
  ratingDistribution: RatingDistribution[],
): number {
  let totalWeightedRating = 0;
  let totalCount = 0;

  // Sum up the weighted ratings (rating_value * count)
  ratingDistribution.forEach((item) => {
    totalWeightedRating += item.rating_value * item.count;
    totalCount += item.count;
  });

  // Calculate the weighted average
  const averageRating = totalCount > 0 ? totalWeightedRating / totalCount : 0;

  // Round to 1 decimal place (optional)
  return Math.round(averageRating * 10) / 10;
}

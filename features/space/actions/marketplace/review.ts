"use server";
import { revalidatePath } from "next/cache";
import type {
  CreateReviewInput,
  Review,
  ReviewFeedbackInput,
} from "@/features/space/types";
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

    // Create the review
    const { data: review, error: reviewError } = await supabase
      .from("reviews")
      .insert({
        user_id: user.id,
        item_id: input.item_id,
        order_id: input.order_id,
        rating: input.rating,
        title: input.title,
        content: input.content,
      })
      .select()
      .single();

    console.log("Review created:", review);

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

// Get reviews for an item
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
          full_name
        )
      `,
      )
      .eq("item_id", itemId)
      .order("created_at", { ascending: false });

    if (reviewsError) {
      throw new Error(reviewsError.message);
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    // If user is logged in, get their feedback on these reviews
    let reviewsWithFeedback = reviews;

    if (user) {
      const { data: feedbacks, error: feedbackError } = await supabase
        .from("review_feedback")
        .select("*")
        .eq("user_id", user.id)
        .in(
          "review_id",
          reviews.map((r) => r.id),
        );

      if (feedbackError) {
        throw new Error(feedbackError.message);
      }

      // Add user feedback to reviews
      reviewsWithFeedback = reviews.map((review) => {
        const feedback = feedbacks.find((f) => f.review_id === review.id);
        return {
          ...review,
          user_name: review.user[0]?.full_name || "Anonymous",
          user_feedback: feedback
            ? feedback.is_helpful
              ? "helpful"
              : "unhelpful"
            : null,
        };
      });
    } else {
      // Just add user_name without feedback
      reviewsWithFeedback = reviews.map((review) => ({
        ...review,
        user_name: review.user[0]?.full_name || "Anonymous",
        user_feedback: null,
      }));
    }

    return { success: true, data: reviewsWithFeedback as Review[] };
  } catch (error) {
    console.error("Error fetching item reviews:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch reviews",
    };
  }
}

// Delete a review
export async function deleteReview(
  reviewId: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    // Get the item_id to revalidate the path
    const { data: reviewData } = await supabase
      .from("reviews")
      .select("item_id")
      .eq("id", reviewId)
      .single();

    // Delete the review
    const { error: reviewError } = await supabase
      .from("reviews")
      .delete()
      .eq("id", reviewId)
      .eq("user_id", user.id);

    if (reviewError) {
      throw new Error(reviewError.message);
    }

    if (reviewData) {
      revalidatePath(`/marketplace/${reviewData.item_id}`);
    }

    return { success: true };
  } catch (error) {
    console.error("Error deleting review:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete review",
    };
  }
}

// Submit feedback for a review (helpful/unhelpful)
export async function submitReviewFeedback(
  input: ReviewFeedbackInput,
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    // Check if user has already submitted feedback for this review
    const { data: existingFeedback, error: checkError } = await supabase
      .from("review_feedback")
      .select("id, is_helpful")
      .eq("user_id", user.id)
      .eq("review_id", input.review_id)
      .maybeSingle();

    if (checkError) {
      throw new Error(checkError.message);
    }

    // Start a transaction
    if (existingFeedback) {
      // If feedback exists and is different, update it
      if (existingFeedback.is_helpful !== input.is_helpful) {
        // Update the feedback
        const { error: updateError } = await supabase
          .from("review_feedback")
          .update({ is_helpful: input.is_helpful })
          .eq("id", existingFeedback.id);

        if (updateError) {
          throw new Error(updateError.message);
        }

        // Update the counts on the review
        const { error: reviewError } = await supabase.rpc(
          "update_review_feedback_counts",
          {
            review_id_param: input.review_id,
            old_is_helpful: existingFeedback.is_helpful,
            new_is_helpful: input.is_helpful,
          },
        );

        if (reviewError) {
          throw new Error(reviewError.message);
        }
      }
    } else {
      // Insert new feedback
      const { error: insertError } = await supabase
        .from("review_feedback")
        .insert({
          user_id: user.id,
          review_id: input.review_id,
          is_helpful: input.is_helpful,
        });

      if (insertError) {
        throw new Error(insertError.message);
      }

      // Update the counts on the review
      const updateField = input.is_helpful
        ? "helpful_count"
        : "unhelpful_count";
      const { error: reviewError } = await supabase
        .from("reviews")
        .update({ [updateField]: supabase.rpc("increment", { x: 1 }) })
        .eq("id", input.review_id);

      if (reviewError) {
        throw new Error(reviewError.message);
      }
    }

    // Get the item_id to revalidate the path
    const { data: reviewData } = await supabase
      .from("reviews")
      .select("item_id")
      .eq("id", input.review_id)
      .single();

    if (reviewData) {
      revalidatePath(`/marketplace/${reviewData.item_id}`);
    }

    return { success: true };
  } catch (error) {
    console.error("Error submitting review feedback:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to submit feedback",
    };
  }
}

"use client";

import React from "react";

import { useState } from "react";
import { Loader2, Star, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import type { Review } from "@/features/space/types";
import { useGetItemReviews } from "../../hooks/marketplace/use-get-item-reviews";
import { useCreateReview } from "../../hooks/marketplace/use-create-review";

export default function ProductReviews({
  productId,
  rating,
  reviewsCount,
}: {
  productId: string;
  rating: number;
  reviewsCount: number;
}) {
  const { data: reviews, isLoading } = useGetItemReviews(productId);
  const { mutate: createReview, isPending: isSubmitting } = useCreateReview();

  const [sortBy, setSortBy] = useState("newest");
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: "",
    content: "",
  });

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.title || !newReview.content) {
      return;
    }

    createReview(
      {
        item_id: productId,
        rating: newReview.rating,
        title: newReview.title,
        content: newReview.content,
      },
      {
        onSuccess: () => {
          setNewReview({
            rating: 5,
            title: "",
            content: "",
          });
        },
      },
    );
  };

  // Replace the hardcoded ratingDistribution with this dynamic calculation
  const ratingDistribution = React.useMemo(() => {
    if (!reviews || reviews.length === 0) {
      return { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    }

    // Count reviews for each rating
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((review) => {
      // Ensure the rating is between 1-5
      const rating = Math.min(Math.max(Math.round(review.rating), 1), 5);
      distribution[rating as keyof typeof distribution]++;
    });

    return distribution;
  }, [reviews]);

  // Add this calculation for the average rating based on actual reviews
  const calculatedRating = React.useMemo(() => {
    if (!reviews || reviews.length === 0) return rating; // Use the prop as fallback

    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return Number.parseFloat((sum / reviews.length).toFixed(1));
  }, [reviews, rating]);

  // Sort reviews based on selected option
  const sortedReviews = reviews
    ? [...reviews].sort((a, b) => {
        switch (sortBy) {
          case "newest":
            return (
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
            );
          case "highest":
            return b.rating - a.rating;
          case "lowest":
            return a.rating - b.rating;
          default:
            return 0;
        }
      })
    : [];

  return (
    <div className="space-y-8">
      {/* Rating Summary */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Customer Reviews</h3>

          <div className="flex items-center gap-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-6 w-6 ${
                    i < Math.floor(calculatedRating)
                      ? "text-yellow-500 fill-yellow-500"
                      : i < calculatedRating
                        ? "text-yellow-500 fill-yellow-500 opacity-50"
                        : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <div>
              <span className="font-medium text-lg">{calculatedRating}</span>
              <span className="text-muted-foreground"> out of 5</span>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            {reviews?.length || reviewsCount} global ratings
          </p>

          {/* Rating Bars */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((star) => {
              const count =
                ratingDistribution[star as keyof typeof ratingDistribution];
              const percentage = reviews?.length
                ? Math.round((count / reviews.length) * 100)
                : 0;

              return (
                <div key={star} className="flex items-center gap-2">
                  <span className="text-sm min-w-[30px]">{star} star</span>
                  <div className="h-2 bg-muted rounded-full flex-1 overflow-hidden">
                    <div
                      className="h-full bg-yellow-400 rounded-full"
                      style={{
                        width: `${percentage}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground min-w-[40px]">
                    {percentage}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Write a Review */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Write a Review</h3>
          <form onSubmit={handleReviewSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewReview({ ...newReview, rating: star })}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`h-6 w-6 ${
                        star <= newReview.rating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label
                htmlFor="review-title"
                className="text-sm font-medium mb-1 block"
              >
                Title
              </label>
              <input
                id="review-title"
                type="text"
                value={newReview.title}
                onChange={(e) =>
                  setNewReview({ ...newReview, title: e.target.value })
                }
                placeholder="Summarize your experience"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label
                htmlFor="review-content"
                className="text-sm font-medium mb-1 block"
              >
                Review
              </label>
              <Textarea
                id="review-content"
                value={newReview.content}
                onChange={(e) =>
                  setNewReview({ ...newReview, content: e.target.value })
                }
                placeholder="Share your experience with this product"
                className="min-h-[120px]"
              />
            </div>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Submit Review"
              )}
            </Button>
          </form>
        </div>
      </div>

      <Separator />

      {/* Reviews List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">
            Reviews ({reviews?.length || 0})
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-sm">Sort by:</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="highest">Highest Rating</SelectItem>
                <SelectItem value="lowest">Lowest Rating</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-8">Loading reviews...</div>
        ) : sortedReviews.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              No reviews yet. Be the first to review this product!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {sortedReviews.map((review: Review) => (
              <div key={review.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="bg-muted rounded-full h-10 w-10 flex items-center justify-center">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">{review.user?.full_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(review.created_at).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          },
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < review.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium">{review.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {review.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

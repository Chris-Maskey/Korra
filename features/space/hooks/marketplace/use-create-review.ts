"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateReviewInput } from "@/features/space/types";
import { toast } from "sonner";
import { createReview } from "../../actions/marketplace/review";

export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateReviewInput) => {
      const result = await createReview(input);

      if (!result.success) {
        throw new Error(result.error || "Failed to create review");
      }

      return result.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["reviews", data?.item_id] });
      toast.success("Review submitted successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to submit review");
    },
  });
}

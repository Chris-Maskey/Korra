"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ReviewFeedbackInput } from "@/features/space/types";
import { toast } from "sonner";
import { submitReviewFeedback } from "../../actions/marketplace/review";

export function useSubmitReviewFeedback(itemId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: ReviewFeedbackInput) => {
      const result = await submitReviewFeedback(input);

      if (!result.success) {
        throw new Error(result.error || "Failed to submit feedback");
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", itemId] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to submit feedback");
    },
  });
}

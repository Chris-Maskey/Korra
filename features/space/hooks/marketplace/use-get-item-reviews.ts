"use client";

import { useQuery } from "@tanstack/react-query";
import { getItemReviews } from "../../actions/marketplace/review";

export function useGetItemReviews(itemId: string) {
  return useQuery({
    queryKey: ["reviews", itemId],
    queryFn: async () => {
      const result = await getItemReviews(itemId);

      if (!result.success) {
        throw new Error(result.error || "Failed to fetch reviews");
      }

      return result.data;
    },
    enabled: !!itemId,
  });
}

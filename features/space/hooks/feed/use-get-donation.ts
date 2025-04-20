"use client";

import { createClient } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";

export function useGetDonations(postId: string) {
  return useQuery({
    queryKey: ["post-donations", postId],
    queryFn: async () => {
      const supabase = createClient();

      // Get total amount raised
      const { data: totalData, error: totalError } = await supabase
        .from("donations")
        .select("amount")
        .eq("post_id", postId)
        .eq("status", "completed");

      if (totalError) {
        throw new Error(totalError.message);
      }

      // Get unique donors count
      const { data: donorsData, error: donorsError } = await supabase
        .from("donations")
        .select("donor_id")
        .eq("post_id", postId)
        .eq("status", "completed");

      if (donorsError) {
        throw new Error(donorsError.message);
      }

      // Calculate total amount (convert from cents to dollars)
      const totalRaised =
        totalData.reduce((sum, donation) => sum + donation.amount, 0) / 100;

      // Get unique donors count
      const uniqueDonors = new Set(donorsData.map((d) => d.donor_id)).size;

      return {
        totalRaised,
        uniqueDonors,
        donations: totalData.length,
      };
    },
    enabled: !!postId,
  });
}

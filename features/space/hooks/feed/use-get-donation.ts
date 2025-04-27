"use client";

import { createClient } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";

export function useGetDonations(postId: string) {
  return useQuery({
    queryKey: ["post-donations", postId],
    queryFn: async () => {
      const supabase = createClient();

      // Get all completed donations for the post to calculate total amount and unique donors
      const { data: donationsData, error: donationsError } = await supabase
        .from("donations")
        .select("amount, donor_id")
        .eq("post_id", postId)
        .eq("status", "completed");

      if (donationsError) {
        throw new Error(donationsError.message);
      }

      // Calculate total amount (convert from cents to dollars)
      const totalRaised =
        donationsData.reduce((sum, donation) => sum + donation.amount, 0) / 100;

      // Get unique donors count
      const uniqueDonors = new Set(donationsData.map((d) => d.donor_id)).size;

      // Total number of completed donation entries
      const totalDonationEntries = donationsData.length;

      console.log("Unique Donors:", uniqueDonors);
      console.log("Total Donation Entries:", totalDonationEntries);

      return {
        totalRaised,
        uniqueDonors,
        // Renamed for clarity
        totalDonationEntries,
      };
    },
    enabled: !!postId,
  });
}

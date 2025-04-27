"use server";

import { createClient } from "@/lib/supabase/server";

export const getFeedRecommendations = async () => {
  const supabase = await createClient();

  const { data: auth, error: authError } = await supabase.auth.getUser();

  if (authError || !auth) {
    throw new Error(authError?.message);
  }

  const { data: userRole } = await supabase
    .from("profiles")
    .select(`role`)
    .eq("id", auth.user.id)
    .single();

  // Get all profiles with followers count
  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select(
      `
    id, full_name, avatar_url, banner_url, user_name, bio, role,
    follows!follows_following_id_fkey(count)
  `,
    )
    .neq("id", auth.user.id);

  // Find the most followed manually
  const mostFollowed = profiles
    ?.map((profile) => ({
      ...profile,
      followersCount: profile.follows?.[0]?.count ?? 0,
    }))
    .sort((a, b) => b.followersCount - a.followersCount)[0];

  // Handle errors
  if (profilesError) {
    console.error("Error fetching profiles:", profilesError);
  }

  let highestRated = null;
  let availablePets = null;

  if (userRole && userRole.role !== "BASIC") {
    // Get highest rated item
    const { data: highestRatedData, error: highestRatedError } = await supabase
      .from("marketplace")
      .select("*")
      .order("average_rating", { ascending: false })
      .limit(1)
      .maybeSingle();

    // Get most recently added pet for adoption
    const { data: availablePetsData, error: availablePetsError } =
      await supabase
        .from("adoption")
        .select("*")
        .eq("adoption_status", "AVAILABLE")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

    if (highestRatedError) {
      console.error("Error fetching highest rated item:", highestRatedError);
    }
    if (availablePetsError) {
      console.error("Error fetching available pets:", availablePetsError);
    }

    if (profilesError && highestRatedError && availablePetsError) {
      throw new Error("Failed to fetch any feed recommendations");
    }

    highestRated = highestRatedData;
    availablePets = availablePetsData;
  }

  return {
    mostFollowed,
    highestRated,
    availablePets,
  };
};

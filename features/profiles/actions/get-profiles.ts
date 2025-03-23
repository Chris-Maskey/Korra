"use server";

import { createClient } from "@/lib/supabase/server";

export const getProfiles = async ({
  page = 1,
  pageSize = 6,
  searchQuery = "",
}: {
  page?: number;
  pageSize?: number;
  searchQuery?: string;
}) => {
  const supabase = await createClient();
  const start = (page - 1) * pageSize;
  const end = start + pageSize - 1;

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (!user || authError) {
    throw new Error("You are not logged in");
  }

  let query = supabase
    .from("profiles")
    .select(
      `*,
      post_count:posts(count)
      `,
      { count: "exact" },
    )
    .neq("id", user.id)
    .order("created_at", { ascending: false })
    .range(start, end);

  if (searchQuery) {
    query = query.or(
      `user_name.ilike.%${searchQuery}%,full_name.ilike.%${searchQuery}%`,
    );
  }

  const { data, error, count } = await query;

  if (error) {
    throw new Error(error.message);
  }

  const hasNextPage = (count || 0) > end + 1;

  return {
    profiles: data || [],
    hasNextPage,
  };
};

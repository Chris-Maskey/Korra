"use server";

import { createClient } from "@/lib/supabase/server";

export const getMarketplaceItems = async ({
  page = 1,
  pageSize = 12,
  searchQuery = "",
}: {
  page?: number;
  pageSize?: number;
  searchQuery?: string;
}) => {
  const supabase = await createClient();
  const start = (page - 1) * pageSize;
  const end = start + pageSize - 1;

  let query = supabase
    .from("marketplace")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false });

  // Full-text search across multiple fields
  if (searchQuery) {
    query = query.or(
      `item_name.ilike.%${searchQuery}%,item_type.ilike.%${searchQuery}%,item_description.ilike.%${searchQuery}%`,
    );
  }

  // Pagination
  query = query.range(start, end);

  const { data, error, count } = await query;

  if (error) {
    throw new Error(error.message);
  }

  const hasNextPage = (count || 0) > end + 1;

  return {
    marketplaceItem: data || [],
    hasNextPage,
  };
};

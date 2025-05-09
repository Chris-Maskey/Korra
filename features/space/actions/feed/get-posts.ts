"use server";

import { createClient } from "@/lib/supabase/server";
import { FeedType } from "../../types";

export const getPosts = async ({
  page = 1,
  pageSize = 2,
  postType = "NORMAL",
}: {
  page?: number;
  pageSize?: number;
  postType?: FeedType;
}) => {
  const supabase = await createClient();
  const start = (page - 1) * pageSize;
  const end = start + pageSize - 1;

  const { data, error, count } = await supabase
    .from("posts")
    .select(
      `
      id,
      content,
      image_url,
      created_at,
      type,
      profiles:profiles(id,full_name, avatar_url),
      likes:likes(id, user_id),
      comments:comments(
        id,
        content,
        created_at,
        profiles:profiles(full_name, avatar_url)
      )
      `,
      { count: "exact" },
    )
    .eq("type", postType)
    .order("created_at", { referencedTable: "comments", ascending: false })
    .order("created_at", { ascending: false })
    .range(start, end);

  if (error) {
    throw new Error(error.message);
  }

  const hasNextPage = (count || 0) > end + 1;

  return {
    posts: data || [],
    hasNextPage,
  };
};

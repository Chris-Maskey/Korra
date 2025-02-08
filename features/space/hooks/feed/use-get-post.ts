"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { getPosts } from "../../actions/feed/get-posts";
import { FeedType } from "../../types";

export const useGetPosts = ({ postType }: { postType?: FeedType }) => {
  return useInfiniteQuery({
    queryKey: ["posts", postType],
    queryFn: async ({ pageParam = 1 }) => {
      const { posts, hasNextPage } = await getPosts({
        page: pageParam,
        postType,
      });
      return { posts, hasNextPage };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, _, lastPageParam) => {
      return lastPage.hasNextPage ? lastPageParam + 1 : undefined;
    },
    refetchInterval: 300000,
  });
};

"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { getProfiles } from "../actions/get-profiles";

export const useGetProfiles = ({ searchQuery }: { searchQuery?: string }) => {
  return useInfiniteQuery({
    queryKey: ["profiles", searchQuery],
    queryFn: async ({ pageParam = 1 }) => {
      const { profiles, hasNextPage } = await getProfiles({
        page: pageParam,
        searchQuery,
      });
      return { profiles, hasNextPage };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, _, lastPageParam) => {
      return lastPage.hasNextPage ? lastPageParam + 1 : undefined;
    },
    refetchInterval: 300000,
  });
};

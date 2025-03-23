import { useInfiniteQuery } from "@tanstack/react-query";
import { getPostsByUserId } from "../actions/get-post-by-userId";

export const useGetPostsByUserId = (userId: string) => {
  return useInfiniteQuery({
    queryKey: ["posts", userId],
    queryFn: async ({ pageParam = 1 }) => {
      const { posts, hasNextPage, count } = await getPostsByUserId({
        page: pageParam,
        userId,
      });
      return { posts, hasNextPage, count };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, _, lastPageParam) => {
      return lastPage.hasNextPage ? lastPageParam + 1 : undefined;
    },
    refetchInterval: 300000,
  });
};

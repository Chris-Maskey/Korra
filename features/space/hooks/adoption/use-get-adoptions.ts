import { useInfiniteQuery } from "@tanstack/react-query";
import { getAdoptions } from "../../actions/adoption/get-adoptions";

export const useGetAdoptions = ({ searchQuery }: { searchQuery?: string }) => {
  return useInfiniteQuery({
    queryKey: ["adoptions", searchQuery],
    queryFn: async ({ pageParam = 1 }) => {
      const { adoptionPosts, hasNextPage } = await getAdoptions({
        page: pageParam,
        searchQuery,
      });
      return { adoptionPosts, hasNextPage };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, _, lastPageParam) => {
      return lastPage.hasNextPage ? lastPageParam + 1 : undefined;
    },
    refetchInterval: 300000,
  });
};

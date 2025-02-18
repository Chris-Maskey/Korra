import { useInfiniteQuery } from "@tanstack/react-query";
import { getMarketplaceItems } from "../../actions/marketplace/get-marketplace-items";

export const useGetMarketplaceItem = ({
  searchQuery,
}: {
  searchQuery?: string;
}) => {
  return useInfiniteQuery({
    queryKey: ["marketplace", searchQuery],
    queryFn: async ({ pageParam = 1 }) => {
      const { marketplaceItem, hasNextPage } = await getMarketplaceItems({
        page: pageParam,
        searchQuery,
      });
      return { marketplaceItem, hasNextPage };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, _, lastPageParam) => {
      return lastPage.hasNextPage ? lastPageParam + 1 : undefined;
    },
    refetchInterval: 300000,
  });
};

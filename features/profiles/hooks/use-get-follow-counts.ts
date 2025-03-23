import { useQuery } from "@tanstack/react-query";
import { getFollowCounts } from "../actions/follow";

export const useGetFollowCounts = (userId: string) => {
  const query = useQuery({
    queryKey: ["follow-counts", userId],
    queryFn: async () => await getFollowCounts(userId),
  });

  return query;
};

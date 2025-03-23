import { useQuery } from "@tanstack/react-query";
import { getFollowStatus } from "../actions/follow";

export const useGetFollowStatus = (userId: string) => {
  const query = useQuery({
    queryKey: ["follow-status", userId],
    queryFn: async () => await getFollowStatus(userId),
  });

  return query;
};

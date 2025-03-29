import { useQuery } from "@tanstack/react-query";
import { getPostCount } from "../actions/get-post-count";

export const useGetPostCounts = (userId: string) => {
  return useQuery({
    queryKey: ["post-counts"],
    queryFn: async () => await getPostCount(userId),
  });
};

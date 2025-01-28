import { useQuery } from "@tanstack/react-query";
import { getPosts } from "../actions/get-posts";

export const useGetPosts = () => {
  const query = useQuery({
    queryKey: ["posts"],
    queryFn: getPosts,
    refetchOnWindowFocus: false,
  });
  return query;
};

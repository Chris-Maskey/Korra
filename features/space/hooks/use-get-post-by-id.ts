import { useQuery } from "@tanstack/react-query";
import { getPostById } from "../actions/get-post-by-id";

export const useGetPostById = (postId: string) => {
  const query = useQuery({
    queryKey: ["post", postId],
    queryFn: () => getPostById(postId),
  });

  return query;
};

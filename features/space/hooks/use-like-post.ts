import { useMutation } from "@tanstack/react-query";
import { likePost } from "../actions/like-post";

export const useLikePost = () => {
  const mutation = useMutation({
    mutationFn: likePost,
  });

  return mutation;
};

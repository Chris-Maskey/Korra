import { useMutation } from "@tanstack/react-query";
import { likePost } from "../actions/like-post";
import { toast } from "sonner";

export const useLikePost = () => {
  const mutation = useMutation({
    mutationFn: likePost,
    onError: (data) => {
      toast.error(data.message);
    },
  });

  return mutation;
};

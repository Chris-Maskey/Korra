import { useMutation } from "@tanstack/react-query";
import { createComment } from "../../actions/feed/create-comments";
import { commentSchema } from "../../schema";
import { toast } from "sonner";

export const useCreateComment = (postId: string) => {
  const mutation = useMutation({
    mutationFn: (data: (typeof commentSchema)["_output"]) =>
      createComment(postId, data),
    onError: (data) => {
      toast.error(data.message);
    },
  });

  return mutation;
};

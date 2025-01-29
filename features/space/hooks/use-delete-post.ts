import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePost } from "../actions/delete-post";
import { toast } from "sonner";

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deletePost,
    onMutate: () => {
      toast.loading("Deleting post...");
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.dismiss();
      toast.success("Post deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  return mutation;
};

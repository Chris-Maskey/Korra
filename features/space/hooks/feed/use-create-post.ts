import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost } from "../../actions/feed/create-post";
import { toast } from "sonner";
import { FeedType } from "../../types";

export const useCreatePost = ({ feedType }: { feedType: FeedType }) => {
  const queryClient = useQueryClient();
  const mutate = useMutation({
    mutationFn: createPost,
    onMutate: () => {
      toast.loading("Creating post...");
    },
    onError: (error) => {
      toast.dismiss();
      toast.error(error.message || "An unexpected error occurred");
    },
    onSuccess: () => {
      toast.dismiss();
      toast.success("Post created successfully");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["posts", feedType] });
    },
  });

  return mutate;
};

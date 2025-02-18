import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAdoptionPost } from "../../actions/adoption/delete-adoption";
import { toast } from "sonner";

export const useDeleteAdoptionPost = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: deleteAdoptionPost,
    onMutate: () => {
      toast.loading("Deleting adoption...");
    },
    onError: (error) => {
      toast.dismiss();
      toast.error(error.message || "An unexpected error occurred");
    },
    onSuccess: () => {
      toast.dismiss();
      toast.success("Adoption deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["adoptions"] });
    },
  });

  return mutation;
};

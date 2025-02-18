import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteMarketplaceItem } from "../../actions/marketplace/delete-marketplace-item";

export const useDeleteMarketplaceItem = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: deleteMarketplaceItem,
    onMutate: () => {
      toast.loading("Deleting marketplace item...");
    },
    onError: (error) => {
      toast.dismiss();
      toast.error(error.message || "An unexpected error occurred");
    },
    onSuccess: () => {
      toast.dismiss();
      toast.success("Item deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["marketplace"] });
    },
  });

  return mutation;
};

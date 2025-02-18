import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createMarketplaceItem } from "../../actions/marketplace/create-marketplace-item";

export const useCreateMarketplaceItem = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: createMarketplaceItem,
    onMutate: () => {
      toast.loading("Creating marketplace item...");
    },
    onError: (error) => {
      toast.dismiss();
      toast.error(error.message || "An unexpected error occurred");
    },
    onSuccess: () => {
      toast.dismiss();
      toast.success("Item created successfully");
      queryClient.invalidateQueries({ queryKey: ["marketplace"] });
    },
  });

  return mutation;
};

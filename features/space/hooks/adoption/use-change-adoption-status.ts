import { useMutation, useQueryClient } from "@tanstack/react-query";
import { changeAdoptionStatus } from "../../actions/adoption/change-adoption-status";
import { toast } from "sonner";

export const useChangeAdoptionStatus = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: changeAdoptionStatus,
    onMutate: () => {
      toast.loading("Changing adoption status...");
    },
    onError: (error) => {
      toast.dismiss();
      toast.error(error.message || "An unexpected error occurred");
    },
    onSuccess: () => {
      toast.dismiss();
      toast.success("Adoption status changed successfully");
      queryClient.invalidateQueries({ queryKey: ["adoptions"] });
    },
  });

  return mutation;
};

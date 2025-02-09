import { useMutation } from "@tanstack/react-query";
import { createAdoption } from "../../actions/adoption/create-adoption";
import { toast } from "sonner";

export const useCreateAdoption = () => {
  const mutation = useMutation({
    mutationFn: createAdoption,
    onMutate: () => {
      toast.loading("Creating adoption...");
    },
    onError: (error) => {
      toast.dismiss();
      toast.error(error.message || "An unexpected error occurred");
    },
    onSuccess: () => {
      toast.dismiss();
      toast.success("Adoption created successfully");
    },
  });

  return mutation;
};

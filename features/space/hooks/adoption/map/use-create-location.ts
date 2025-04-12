import { createLocation } from "@/features/space/actions/map/create-location";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useCreateLocation = () => {
  const mutation = useMutation({
    mutationFn: createLocation,
    onMutate: () => {
      toast.loading("Adding your location to the map...");
    },
    onSuccess: () => {
      toast.dismiss();
      toast.success("Location added successfully");
    },
    onError: (error) => {
      toast.dismiss();
      toast.error(error.message);
    },
  });

  return mutation;
};

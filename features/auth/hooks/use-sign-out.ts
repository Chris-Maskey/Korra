import { useMutation } from "@tanstack/react-query";
import { signOut } from "../actions/sign-out";
import { toast } from "sonner";

export const useSignOut = () => {
  const mutate = useMutation({
    mutationFn: signOut,
    onMutate: () => {
      toast.promise(signOut, {
        loading: "Signing Out",
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  return mutate;
};

import { useMutation } from "@tanstack/react-query";
import { signIn } from "../actions/sign-in";
import { toast } from "sonner";

export const useSignIn = () => {
  const mutate = useMutation({
    mutationFn: signIn,
    onMutate: (data) => {
      toast.promise(signIn(data), {
        loading: "Signing In",
      });
    },
    onError: (error) => {
      toast.error(error.message || "An unexpected error occurred");
    },
  });

  return mutate;
};

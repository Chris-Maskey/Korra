import { useMutation } from "@tanstack/react-query";
import { signInWithOAuth } from "../actions/sign-in-with-oauth";
import { toast } from "sonner";

export const useSignInWithOAuth = () => {
  const mutate = useMutation({
    mutationFn: signInWithOAuth,
    onMutate: (data) => {
      toast.promise(signInWithOAuth(data), {
        loading: "Signing In",
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return mutate;
};

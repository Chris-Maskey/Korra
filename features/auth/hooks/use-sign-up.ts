import { toast } from "sonner";
import { signUp } from "../actions/sign-up";
import { useMutation } from "@tanstack/react-query";

export const useSignUp = () => {
  const mutate = useMutation({
    mutationFn: signUp,
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  return mutate;
};

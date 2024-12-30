import { useMutation } from "@tanstack/react-query";
import { signIn } from "../actions/sign-in";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const useSignIn = () => {
  const router = useRouter();
  const mutate = useMutation({
    mutationFn: signIn,
    onSuccess: (data) => {
      toast.success(data.message);
      router.push("/space");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return mutate;
};

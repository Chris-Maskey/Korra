import { useMutation } from "@tanstack/react-query";
import { signOut } from "../actions/sign-out";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const useSignOut = () => {
  const router = useRouter();
  const mutate = useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      toast.success("Sign-Out Successful");
      router.push("/auth");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  return mutate;
};

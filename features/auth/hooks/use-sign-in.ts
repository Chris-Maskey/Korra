import { useMutation } from "@tanstack/react-query";
import { signIn } from "../actions/sign-in";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const useSignIn = () => {
  const router = useRouter();
  const mutate = useMutation({
    mutationFn: signIn,
    onMutate: () => {
      toast.loading("Signing In...");
    },
    onError: (error) => {
      toast.dismiss();
      toast.error(error.message || "An unexpected error occurred");
    },
    onSuccess: () => {
      toast.dismiss();
      toast.success("Signed In");
      router.refresh();
      router.push("/space/feed");
    },
  });

  return mutate;
};

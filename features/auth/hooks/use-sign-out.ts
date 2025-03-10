import { useMutation } from "@tanstack/react-query";
import { signOut } from "../actions/sign-out";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const useSignOut = () => {
  const router = useRouter();
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
    onSuccess: () => {
      router.push("/auth");
    },
  });
  return mutate;
};

import { useMutation } from "@tanstack/react-query";
import { getPremium } from "../actions/get-premium";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useGetPremium = () => {
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: getPremium,
    onSuccess: (url) => {
      if (url) {
        router.push(url);
      }
    },
    onError: () => {
      toast.error("Failed to subscribe to premium plan");
    },
  });

  return mutation;
};

"use client";

import { useMutation } from "@tanstack/react-query";
import type {
  QueryClient,
  QueryKey,
  UseMutationResult,
} from "@tanstack/react-query";
import type { Tables } from "@/database.types";
import { updateUser } from "../actions/update-user";
import { toast } from "sonner";
import type { settingSchema } from "../schema";

type ErrorType = { message: string };

export const useUpdateUser = (options?: {
  queryClient?: QueryClient;
  queryKey?: QueryKey;
}): UseMutationResult<
  Tables<"profiles">,
  ErrorType,
  (typeof settingSchema)["_output"]
> => {
  return useMutation({
    mutationFn: (data: (typeof settingSchema)["_output"]) => updateUser(data),
    onMutate: (data) => {
      toast.promise(updateUser(data), {
        loading: "Updating Profile...",
      });
    },
    onSuccess: async () => {
      if (options?.queryClient && options?.queryKey) {
        await options.queryClient.invalidateQueries({
          queryKey: options.queryKey,
        });
      }
      toast.dismiss();
      toast.success("Profile updated successfully!");
    },
    onError: (error) => {
      toast.dismiss();
      toast.error(error.message);
      return { message: error.message };
    },
  });
};

export type { ErrorType as UpdateUserErrorType };

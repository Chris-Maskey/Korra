"use client";

import { useQuery } from "@tanstack/react-query";
import { getProfile } from "../actions/get-profile";

export const useGetProfile = (userId: string) => {
  const query = useQuery({
    queryKey: ["profiles", userId],
    queryFn: async () => await getProfile({ userId }),
    refetchInterval: 300000,
  });

  return query;
};

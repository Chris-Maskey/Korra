import { useQuery } from "@tanstack/react-query";
import { currentUser } from "../actions/current-user";
import { Tables } from "@/database.types";

export const useCurrentUser = () => {
  const query = useQuery({
    queryKey: ["current-user"],
    queryFn: currentUser,
    select: (data) => data as Tables<"profiles">,
    refetchOnWindowFocus: false,
  });

  return query;
};

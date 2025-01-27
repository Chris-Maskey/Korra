import { useQuery } from "@tanstack/react-query";
import { currentUser } from "../actions/current-user";
import { Database } from "@/database.types";

export const useCurrentUser = () => {
  const query = useQuery({
    queryKey: ["current-user"],
    queryFn: currentUser,
    select: (data) => data as Database["public"]["Tables"]["profiles"]["Row"],
  });

  return query;
};

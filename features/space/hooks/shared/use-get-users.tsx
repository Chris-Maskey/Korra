import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../../actions/shared/get-users";

export const useGetUsers = () => {
  const query = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  return query;
};

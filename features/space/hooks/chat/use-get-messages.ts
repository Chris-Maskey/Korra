import { useQuery } from "@tanstack/react-query";
import { getMessages } from "../../actions/chat/get-messages";

export const useGetMessages = (recepientId: string) => {
  const query = useQuery({
    queryKey: ["messages", recepientId],
    queryFn: async () => await getMessages(recepientId),
  });

  return query;
};

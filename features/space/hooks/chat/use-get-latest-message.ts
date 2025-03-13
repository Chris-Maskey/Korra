import { useQuery } from "@tanstack/react-query";
import { getLatestMessage } from "../../actions/chat/get-last-message";

export const useGetLatestMessage = (recipientId: string) => {
  return useQuery({
    queryKey: ["latestMessage", recipientId],
    queryFn: async () => {
      if (!recipientId) return null;
      return await getLatestMessage(recipientId);
    },
    enabled: !!recipientId,
    staleTime: 1000 * 60 * 2, // 2 minutes cache
  });
};

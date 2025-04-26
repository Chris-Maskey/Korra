import { useQuery } from "@tanstack/react-query";
import { getFeedRecommendations } from "../../actions/feed/recommendation";

export const useFeedRecommendations = () => {
  const query = useQuery({
    queryKey: ["feedRecommendations"],
    queryFn: getFeedRecommendations,
  });

  return query;
};

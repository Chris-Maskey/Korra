import { getPetShopLocations } from "@/features/space/actions/map/get-pet-locations";
import { useQuery } from "@tanstack/react-query";

export const useGetPetShopLocation = () => {
  const query = useQuery({
    queryKey: ["petshop-locations"],
    queryFn: getPetShopLocations,
  });

  return query;
};

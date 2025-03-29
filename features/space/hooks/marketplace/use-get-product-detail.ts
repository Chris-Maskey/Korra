import { useQuery } from "@tanstack/react-query";
import { getProductDetail } from "../../actions/marketplace/get-product-detail";

export const useGetProductDetail = (id: string) => {
  return useQuery({
    queryKey: ["marketplace-item", id],
    queryFn: async () => await getProductDetail(id),
    enabled: !!id,
  });
};

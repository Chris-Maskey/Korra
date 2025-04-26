import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Database } from "@/database.types";
import { changeOrderStatus } from "../../actions/marketplace/order";

// Define the type for the variables passed to the mutation
type ChangeOrderStatusVariables = {
  orderId: string;
  orderStatus: Database["public"]["Enums"]["order_status"];
};

export const useChangeOrderStatus = () => {
  const mutation = useMutation<void, Error, ChangeOrderStatusVariables>({
    mutationFn: async ({ orderId, orderStatus }) =>
      await changeOrderStatus(orderId, orderStatus),
    onMutate: () => {
      toast.loading("Changing order status...");
    },
    onSuccess: () => {
      toast.dismiss();
      toast.success("Order status changed successfully!");
    },
    onError: (error) => {
      toast.dismiss();
      toast.error(`Failed to change order status: ${error.message}`);
    },
  });

  return mutation;
};

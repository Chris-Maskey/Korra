"use client";

import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { buyItem } from "../../actions/marketplace/buy-item";
import { useState } from "react";
import { toast } from "sonner";

type BuyButtonProps = {
  productId: string;
  quantity: number;
  deletePending?: boolean;
  disabled?: boolean;
};

export const BuyButton = ({
  productId,
  quantity,
  deletePending,
  disabled,
}: BuyButtonProps) => {
  const [loading, setLoading] = useState(false);

  const handleBuy = async () => {
    try {
      setLoading(true);
      toast.info("Redirecting to checkout...");
      await buyItem(productId, quantity);
    } catch (error) {
      console.error("Error during checkout:", error);
      toast.error("Failed to process checkout");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleBuy}
      disabled={deletePending || loading || disabled}
      className="flex items-center justify-center w-full gap-2"
      aria-label={`Buy ${quantity} item${quantity > 1 ? "s" : ""}`}
    >
      <ShoppingBag size={20} />
      {loading ? "Processing..." : "Buy Now"}
    </Button>
  );
};

"use client";

import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { buyItem } from "../../actions/marketplace/buy-item";
import { useState } from "react";

type BuyButtonProps = {
  productId: string;
  quantity: number;
  deletePending?: boolean;
};

export const BuyButton = ({
  productId,
  quantity,
  deletePending,
}: BuyButtonProps) => {
  const [loading, setLoading] = useState(false);

  const handleBuy = async () => {
    setLoading(true);
    await buyItem(productId, quantity);
    setLoading(false);
  };

  return (
    <Button
      onClick={handleBuy}
      disabled={deletePending || loading}
      className="flex items-center justify-center w-full gap-2"
    >
      <ShoppingBag size={20} />
      Buy
    </Button>
  );
};

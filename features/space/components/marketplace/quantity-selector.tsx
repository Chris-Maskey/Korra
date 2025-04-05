"use client";

import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuantitySelectorProps {
  quantity: number;
  maxQuantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
}

export function QuantitySelector({
  quantity,
  maxQuantity,
  onIncrease,
  onDecrease,
}: QuantitySelectorProps) {
  return (
    <div>
      <label
        htmlFor="quantity-selector"
        className="text-sm font-medium mb-2 block"
      >
        Quantity
      </label>
      <div className="flex items-center">
        <Button
          variant="outline"
          size="icon"
          onClick={onDecrease}
          disabled={quantity <= 1}
          aria-label="Decrease quantity"
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span
          id="quantity-selector"
          className="w-12 text-center"
          aria-live="polite"
        >
          {quantity}
        </span>
        <Button
          variant="outline"
          size="icon"
          onClick={onIncrease}
          disabled={quantity >= maxQuantity}
          aria-label="Increase quantity"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

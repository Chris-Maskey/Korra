import { formatPrice } from "@/lib/currency-formatter";

interface PriceSummaryProps {
  quantity: number;
  unitPrice: number;
  currency: string;
}

export function PriceSummary({
  quantity,
  unitPrice,
  currency,
}: PriceSummaryProps) {
  const totalAmount = unitPrice * quantity;

  return (
    <div className="bg-muted p-4 rounded-lg mt-4">
      <div className="flex justify-between items-center">
        <span className="font-medium">Total:</span>
        <span className="text-xl font-bold">
          {formatPrice(totalAmount, currency)}
        </span>
      </div>
      <div className="text-xs text-muted-foreground mt-1">
        {quantity} {quantity === 1 ? "item" : "items"} ×{" "}
        {formatPrice(unitPrice, currency)}
      </div>
    </div>
  );
}

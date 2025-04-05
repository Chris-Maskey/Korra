import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/currency-formatter";

interface ProductHeaderProps {
  name: string;
  type: string;
  price: number;
  currency: string;
  averageRating: number;
  reviewsCount: number;
  inStock: boolean;
  quantity: number;
}

export function ProductHeader({
  name,
  type,
  price,
  currency,
  averageRating,
  reviewsCount,
  inStock,
  quantity,
}: ProductHeaderProps) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <Badge variant="outline" className="text-xs font-normal">
          {type}
        </Badge>
        <div className="flex items-center gap-1 text-amber-500">
          <Star className="h-4 w-4 fill-current" />
          <span className="text-sm font-medium">{averageRating}</span>
          <span className="text-xs text-muted-foreground">
            ({reviewsCount} reviews)
          </span>
        </div>
      </div>
      <h1 className="text-3xl font-bold mt-2">{name}</h1>
      <div className="flex items-center mt-2">
        <span className="text-2xl font-bold">
          {formatPrice(price, currency)}
        </span>
        {inStock ? (
          <Badge
            variant="outline"
            className="ml-3 bg-green-50 text-green-700 border-green-200"
          >
            In Stock ({quantity})
          </Badge>
        ) : (
          <Badge
            variant="outline"
            className="ml-3 bg-red-50 text-red-700 border-red-200"
          >
            Out of Stock
          </Badge>
        )}
      </div>
    </div>
  );
}

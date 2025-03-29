"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowLeft, Minus, Plus, Share, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import ProductReviews from "./product-reviews";
import ProductDetailSkeleton from "./product-detail-skeleton";
import { BuyButton } from "./buy-button";
import { useGetProductDetail } from "../../hooks/marketplace/use-get-product-detail";
import { useParams } from "next/navigation";

const getCurrencySymbol = (currency: string) => {
  switch (currency) {
    case "USD":
      return "$";
    case "EUR":
      return "€";
    case "GBP":
      return "£";
    case "JPY":
      return "¥";
    case "NPR":
      return "रू";
    default:
      return "$";
  }
};

export default function ProductDetail() {
  const params = useParams<{ productId: string }>();
  const { data: product, isLoading: loading } = useGetProductDetail(
    params.productId,
  );
  const [quantity, setQuantity] = useState(1);

  const handleShareProduct = async () => {
    await navigator.clipboard.writeText(
      `${process.env.NEXT_PUBLIC_APP_URL}/marketplace/${params.productId}`,
    );
    toast.success("Link copied to clipboard");
  };

  if (loading) {
    return <ProductDetailSkeleton />;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  const handleQuantityDecrease = () => {
    setQuantity(Math.max(1, quantity - 1));
  };

  const handleQuantityIncrease = () => {
    if (quantity < product.product.item_quantity) {
      setQuantity(quantity + 1);
    } else {
      toast("Maximum quantity reached", {
        description: `Only ${product.product.item_quantity} items available in stock.`,
      });
    }
  };

  const totalAmount = (product.product.item_price * quantity).toFixed(2);

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link
          href="/space/marketplace"
          className="flex items-center gap-1 hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Marketplace
        </Link>
      </div>

      {/* Product Overview */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="border rounded-lg overflow-hidden bg-background">
            <Image
              src={product.product.image_url || "/placeholder.svg"}
              alt={product.product.item_name}
              width={600}
              height={600}
              className="object-fit w-full h-[400px] md:h-[500px]"
              priority
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-xs font-normal">
                {product.product.item_type}
              </Badge>
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="h-4 w-4 fill-current" />
                <span className="text-sm font-medium">
                  {product.sellerStats
                    ? product.sellerStats[0].average_rating
                    : 0}
                </span>
                <span className="text-xs text-muted-foreground">
                  ({product.reviewsCount} reviews)
                </span>
              </div>
            </div>
            <h1 className="text-3xl font-bold mt-2">
              {product.product.item_name}
            </h1>
            <div className="flex items-center mt-2">
              <span className="text-2xl font-bold">
                {getCurrencySymbol(product.product.currency)}
                {product.product.item_price.toFixed(2)}
              </span>
              {product.product.item_quantity > 0 ? (
                <Badge
                  variant="outline"
                  className="ml-3 bg-green-50 text-green-700 border-green-200"
                >
                  In Stock
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

          <p className="text-muted-foreground">
            {product.product.item_description}
          </p>

          <Separator />

          <div className="space-y-4">
            {/* Quantity */}
            <div>
              <label className="text-sm font-medium mb-2 block">Quantity</label>
              <div className="flex items-center">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleQuantityDecrease}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleQuantityIncrease}
                  disabled={quantity >= product.product.item_quantity}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Total Amount */}
            <div className="bg-muted p-4 rounded-lg mt-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total:</span>
                <span className="text-xl font-bold">
                  {getCurrencySymbol(product.product.currency)}
                  {totalAmount}
                </span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {quantity} {quantity === 1 ? "item" : "items"} ×{" "}
                {getCurrencySymbol(product.product.currency)}
                {product.product.item_price.toFixed(2)}
              </div>
            </div>
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <BuyButton productId={product.product.id} quantity={quantity} />
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                className=""
                onClick={handleShareProduct}
              >
                <Share className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <Separator />
      <ProductReviews
        productId={params.productId}
        rating={product.sellerStats ? product.sellerStats[0].average_rating : 0}
        reviewsCount={product.reviewsCount}
      />
    </div>
  );
}

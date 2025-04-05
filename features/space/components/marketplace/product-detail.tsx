"use client";

import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Share } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useGetProductDetail } from "../../hooks/marketplace/use-get-product-detail";
import ProductDetailSkeleton from "./product-detail-skeleton";
import ProductReviews from "./product-reviews";
import { BuyButton } from "./buy-button";
import { ProductImage } from "./product-image";
import { ProductHeader } from "./product-header";
import { QuantitySelector } from "./quantity-selector";
import { PriceSummary } from "./price-summary";

export default function ProductDetail() {
  const params = useParams<{ productId: string }>();
  const { data, isLoading, error } = useGetProductDetail(params.productId);
  const [quantity, setQuantity] = useState(1);

  console.log(data);

  // Extract product and stats from data
  const product = useMemo(() => data?.product, [data]);
  const reviewsCount = useMemo(() => data?.reviewsCount || 0, [data]);
  const averageRating = useMemo(() => data?.averageRating || 0, [data]);

  // Handle quantity changes
  const handleQuantityDecrease = useCallback(() => {
    setQuantity((prev) => Math.max(1, prev - 1));
  }, []);

  const handleQuantityIncrease = useCallback(() => {
    if (!product) return;

    if (quantity < product.item_quantity) {
      setQuantity((prev) => prev + 1);
    } else {
      toast("Maximum quantity reached", {
        description: `Only ${product.item_quantity} items available in stock.`,
      });
    }
  }, [quantity, product]);

  // Handle share product
  const handleShareProduct = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(
        `${process.env.NEXT_PUBLIC_APP_URL}/marketplace/${params.productId}`,
      );
      toast.success("Link copied to clipboard");
    } catch (err) {
      toast.error("Failed to copy link");
      console.error("Failed to copy link:", err);
    }
  }, [params.productId]);

  // Show loading state
  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  // Show error state
  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="text-xl font-semibold mb-2">
          Error loading product details
        </h2>
        <p className="text-muted-foreground mb-4">
          {error?.message || "The product could not be found."}
        </p>
        <Link href="/space/marketplace">
          <Button>Return to Marketplace</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link
          href="/space/marketplace"
          className="flex items-center gap-1 hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Marketplace</span>
        </Link>
      </div>

      {/* Product Overview */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <ProductImage
            imageUrl={product.image_url}
            productName={product.item_name}
          />
        </div>

        {/* Product Info */}
        <div className="space-y-4">
          <ProductHeader
            name={product.item_name}
            type={product.item_type}
            price={product.item_price}
            currency={product.currency}
            averageRating={averageRating}
            reviewsCount={reviewsCount}
            inStock={product.item_quantity > 0}
            quantity={product.item_quantity}
          />

          <p className="text-muted-foreground">{product.item_description}</p>

          <Separator />

          <div className="space-y-4">
            {/* Quantity */}
            <QuantitySelector
              quantity={quantity}
              maxQuantity={product.item_quantity}
              onIncrease={handleQuantityIncrease}
              onDecrease={handleQuantityDecrease}
            />

            {/* Total Amount */}
            <PriceSummary
              quantity={quantity}
              unitPrice={product.item_price}
              currency={product.currency}
            />
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <BuyButton productId={product.id} quantity={quantity} />
            <Button
              variant="outline"
              size="icon"
              onClick={handleShareProduct}
              aria-label="Share product"
            >
              <Share className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Product Reviews */}
      <Separator />
      <ProductReviews
        productId={params.productId}
        rating={averageRating}
        reviewsCount={reviewsCount}
      />
    </div>
  );
}

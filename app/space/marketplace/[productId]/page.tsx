import ProductDetail from "@/features/space/components/marketplace/product-detail";
import ProductDetailSkeleton from "@/features/space/components/marketplace/product-detail-skeleton";
import { Suspense } from "react";
export default function ProductDetailPage() {
  return (
    <div className="container py-8 max-w-7xl mx-auto">
      <Suspense fallback={<ProductDetailSkeleton />}>
        <ProductDetail />
      </Suspense>
    </div>
  );
}

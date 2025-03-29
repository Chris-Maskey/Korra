import { Skeleton } from "@/components/ui/skeleton";

export default function ProductDetailSkeleton() {
  return (
    <div className="space-y-8">
      {/* Breadcrumb Skeleton */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-24" />
      </div>

      {/* Product Overview Skeleton */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Product Images Skeleton */}
        <div className="space-y-4">
          <Skeleton className="w-full h-[400px] md:h-[500px] rounded-lg" />
        </div>

        {/* Product Info Skeleton */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-32" />
            </div>
            <Skeleton className="h-10 w-3/4 mt-2" />
            <Skeleton className="h-8 w-32 mt-2" />
          </div>

          <Skeleton className="h-24 w-full" />

          <div className="h-[1px] bg-muted" />

          {/* Product Options Skeleton */}
          <div className="space-y-4">
            <div>
              <Skeleton className="h-5 w-16 mb-2" />
              <div className="flex items-center">
                <Skeleton className="h-9 w-9" />
                <Skeleton className="h-9 w-12 mx-2" />
                <Skeleton className="h-9 w-9" />
              </div>
            </div>
          </div>

          <div className="h-[1px] bg-muted" />

          {/* Action Buttons Skeleton */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Skeleton className="h-12 flex-1" />
            <div className="flex gap-2">
              <Skeleton className="h-12 w-12" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className="mt-12">
        <Skeleton className="h-64 w-full mt-6" />
      </div>
    </div>
  );
}

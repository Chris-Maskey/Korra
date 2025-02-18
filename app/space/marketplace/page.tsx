"use client";

import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { useInView } from "react-intersection-observer";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";

import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Loader2, Luggage } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

import MarketplaceItemCard from "@/features/space/components/marketplace/marketplace-item-card";

import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useGetMarketplaceItem } from "@/features/space/hooks/marketplace/use-get-marketplace-item";
import CreateMarketplaceItem from "@/features/space/components/marketplace/create-marketplace-item";
// import { useRouter } from "next/navigation";

const MarketplacePage = () => {
  const { ref, inView } = useInView();

  const { data: user } = useCurrentUser();

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearch] = useDebounce(searchQuery, 500);

  // const router = useRouter();

  const {
    data,
    error,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useGetMarketplaceItem({ searchQuery: debouncedSearch });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
  }, [error]);

  // useEffect(() => {
  //   if (user?.role === "BASIC") {
  //     router.push("/space/feed");
  //   }
  // }, [user?.role, router]);

  const marketplaceItems =
    data?.pages.flatMap((page) => page.marketplaceItem) || [];

  const availableMarketplaceItems = marketplaceItems.filter(
    (item) => item.user_id !== user?.id,
  );
  const userMarketplaceItems = marketplaceItems.filter(
    (item) => item.user_id === user?.id,
  );

  return (
    <div className="bg-background">
      <div className="relative overflow-hidden">
        <div className="" />
        <div className="container mx-auto px-4 py-8 relative">
          <div className="flex flex-col space-y-6">
            <div className="flex items-center gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-4xl font-bold">Marketplace</h1>
                  <Luggage className="w-8 h-8 animate-bounce text-primary" />
                </div>
                <p className="text-muted-foreground mt-1">
                  Find the perfect products for your furry friends today!
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  className="pl-9"
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for marketplace items..."
                />
              </div>

              <div className="flex gap-2">
                <CreateMarketplaceItem />
              </div>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2">
              <Badge
                variant="outline"
                className={cn(
                  "cursor-pointer hover:bg-primary hover:text-primary-foreground",
                  searchQuery === "" && "bg-primary text-primary-foreground",
                )}
                onClick={() => setSearchQuery("")}
              >
                All items
              </Badge>
              <Badge
                variant="outline"
                className={cn(
                  "cursor-pointer hover:bg-primary hover:text-primary-foreground",
                  searchQuery === "Food" &&
                    "bg-primary text-primary-foreground",
                )}
                onClick={() => setSearchQuery("Food")}
              >
                Food
              </Badge>
              <Badge
                variant="outline"
                className={cn(
                  "cursor-pointer hover:bg-primary hover:text-primary-foreground",
                  searchQuery === "Toys" &&
                    "bg-primary text-primary-foreground",
                )}
                onClick={() => setSearchQuery("Toys")}
              >
                Toys
              </Badge>
              <Badge
                variant="outline"
                className={cn(
                  "cursor-pointer hover:bg-primary hover:text-primary-foreground",
                  searchQuery === "Accessories" &&
                    "bg-primary text-primary-foreground",
                )}
                onClick={() => setSearchQuery("Accessories")}
              >
                Accessories
              </Badge>
              <Badge
                variant="outline"
                className={cn(
                  "cursor-pointer hover:bg-primary hover:text-primary-foreground",
                  searchQuery === "Grooming" &&
                    "bg-primary text-primary-foreground",
                )}
                onClick={() => setSearchQuery("Grooming")}
              >
                Grooming
              </Badge>
              <Badge
                variant="outline"
                className={cn(
                  "cursor-pointer hover:bg-primary hover:text-primary-foreground",
                  searchQuery === "Health" &&
                    "bg-primary text-primary-foreground",
                )}
                onClick={() => setSearchQuery("Health")}
              >
                Health
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Rest of the content */}
      <div className="container mx-auto px-4 pb-12 space-y-8">
        <Tabs defaultValue="available" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="available">Available Items</TabsTrigger>
            <TabsTrigger value="my-listings">My Listings</TabsTrigger>
          </TabsList>
          <TabsContent value="available" className="mt-6">
            {isLoading ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Skeleton className="h-80 w-full rounded-lg" />
                <Skeleton className="h-80 w-full rounded-lg" />
                <Skeleton className="h-80 w-full rounded-lg" />
                <Skeleton className="h-80 w-full rounded-lg" />
                <Skeleton className="h-80 w-full rounded-lg" />
                <Skeleton className="h-80 w-full rounded-lg" />
              </div>
            ) : availableMarketplaceItems.length === 0 ? (
              <div className="max-w-2xl mx-auto py-12 mt-6">
                <p className="text-center text-gray-500">
                  No marketplace items available.
                </p>
              </div>
            ) : (
              <>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {availableMarketplaceItems.map((marketplaceItem) => (
                    <MarketplaceItemCard
                      key={marketplaceItem.id}
                      marketplaceItem={marketplaceItem}
                      userId={user?.id || ""}
                    />
                  ))}
                </div>

                <div ref={ref} className="w-full text-center p-4">
                  {isFetchingNextPage ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      <Skeleton className="h-80 w-full rounded-lg" />
                      <Skeleton className="h-80 w-full rounded-lg" />
                      <Skeleton className="h-80 w-full rounded-lg" />
                      <Skeleton className="h-80 w-full rounded-lg" />
                      <Skeleton className="h-80 w-full rounded-lg" />
                      <Skeleton className="h-80 w-full rounded-lg" />
                    </div>
                  ) : hasNextPage ? (
                    <p className="text-gray-500 flex items-center justify-center gap-2">
                      {" "}
                      Loading more items...{" "}
                      <Loader2 className="size-4 animate-spin" />
                    </p>
                  ) : null}
                </div>
              </>
            )}
          </TabsContent>
          <TabsContent value="my-listings" className="mt-6">
            {isLoading ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Skeleton className="h-80 w-full rounded-lg" />
                <Skeleton className="h-80 w-full rounded-lg" />
                <Skeleton className="h-80 w-full rounded-lg" />
                <Skeleton className="h-80 w-full rounded-lg" />
                <Skeleton className="h-80 w-full rounded-lg" />
                <Skeleton className="h-80 w-full rounded-lg" />
              </div>
            ) : userMarketplaceItems.length === 0 ? (
              <div className="text-center text-muted-foreground py-12">
                <p>You haven&apos;t created any marketplace listings yet.</p>
                <p className="mt-2">
                  Click the &quot;List&quot; button to get started.
                </p>
              </div>
            ) : (
              <>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {userMarketplaceItems.map((marketplaceItem) => (
                    <MarketplaceItemCard
                      key={marketplaceItem.id}
                      marketplaceItem={marketplaceItem}
                      userId={user?.id || ""}
                    />
                  ))}
                </div>

                <div ref={ref} className="w-full text-center p-4">
                  {isFetchingNextPage ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      <Skeleton className="h-80 w-full rounded-lg" />
                      <Skeleton className="h-80 w-full rounded-lg" />
                      <Skeleton className="h-80 w-full rounded-lg" />
                      <Skeleton className="h-80 w-full rounded-lg" />
                      <Skeleton className="h-80 w-full rounded-lg" />
                      <Skeleton className="h-80 w-full rounded-lg" />
                    </div>
                  ) : hasNextPage ? (
                    <p className="text-gray-500 flex items-center justify-center gap-2">
                      {" "}
                      Loading more items...{" "}
                      <Loader2 className="size-4 animate-spin" />
                    </p>
                  ) : null}
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MarketplacePage;

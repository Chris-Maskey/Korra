"use client";

import { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Rabbit, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

import AdoptionCard from "@/features/space/components/adoption/adoption-card";
import CreateAdoptionDialog from "@/features/space/components/adoption/create-adoption-dialog";

import { useInView } from "react-intersection-observer";
import { useGetAdoptions } from "@/features/space/hooks/adoption/use-get-adoptions";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";

import { useDebounce } from "use-debounce";
import { cn } from "@/lib/utils";

export default function AdoptionPage() {
  const { ref, inView } = useInView();

  const { data: user } = useCurrentUser();

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearch] = useDebounce(searchQuery, 500);

  const {
    data,
    error,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useGetAdoptions({ searchQuery: debouncedSearch });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  if (error) {
    toast.error(error.message);
  }

  const adoptionPostData =
    data?.pages.flatMap((page) => page.adoptionPosts) || [];

  const adoptionPosts = adoptionPostData.filter(
    (post) => post.user_id !== user?.id,
  );
  const userAdoptionPosts = adoptionPostData.filter(
    (post) => post.user_id === user?.id,
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
                  <h1 className="text-4xl font-bold">Pet Adoption</h1>
                  <Rabbit className="w-8 h-8 animate-bounce text-primary" />
                </div>
                <p className="text-muted-foreground mt-1">
                  Find your perfect companion today
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  className="pl-9"
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for pets..."
                />
              </div>

              <div className="flex gap-2">
                <CreateAdoptionDialog />
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
                All Pets
              </Badge>
              <Badge
                variant="outline"
                className={cn(
                  "cursor-pointer hover:bg-primary hover:text-primary-foreground",
                  searchQuery === "Dog" && "bg-primary text-primary-foreground",
                )}
                onClick={() => setSearchQuery("Dog")}
              >
                Dogs
              </Badge>
              <Badge
                variant="outline"
                className={cn(
                  "cursor-pointer hover:bg-primary hover:text-primary-foreground",
                  searchQuery === "Cat" && "bg-primary text-primary-foreground",
                )}
                onClick={() => setSearchQuery("Cat")}
              >
                Cats
              </Badge>
              <Badge
                variant="outline"
                className={cn(
                  "cursor-pointer hover:bg-primary hover:text-primary-foreground",
                  searchQuery === "Rabbit" &&
                    "bg-primary text-primary-foreground",
                )}
                onClick={() => setSearchQuery("Rabbit")}
              >
                Rabbits
              </Badge>
              <Badge
                variant="outline"
                className={cn(
                  "cursor-pointer hover:bg-primary hover:text-primary-foreground",
                  searchQuery === "Bird" &&
                    "bg-primary text-primary-foreground",
                )}
                onClick={() => setSearchQuery("Bird")}
              >
                Birds
              </Badge>
              <Badge
                variant="outline"
                className={cn(
                  "cursor-pointer hover:bg-primary hover:text-primary-foreground",
                  searchQuery === "other" &&
                    "bg-primary text-primary-foreground",
                )}
                onClick={() => setSearchQuery("other")}
              >
                Small Pets
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Rest of the content */}
      <div className="container mx-auto px-4 pb-12 space-y-8">
        <Tabs defaultValue="available" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="available">Available Pets</TabsTrigger>
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
            ) : adoptionPosts.length === 0 ? (
              <div className="max-w-2xl mx-auto py-12 mt-6">
                <p className="text-center text-gray-500">
                  No adoptions available.
                </p>
              </div>
            ) : (
              <>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {adoptionPosts.map((adoptionPost) => (
                    <AdoptionCard key={adoptionPost.id} {...adoptionPost} />
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
                      Loading more adoptions...{" "}
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
            ) : userAdoptionPosts.length === 0 ? (
              <div className="text-center text-muted-foreground py-12">
                <p>You haven&apos;t created any adoption listings yet.</p>
                <p className="mt-2">
                  Click the &quot;List for Adoption&quot; button to get started.
                </p>
              </div>
            ) : (
              <>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {userAdoptionPosts.map((adoptionPost) => (
                    <AdoptionCard key={adoptionPost.id} {...adoptionPost} />
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
                      Loading more adoptions...{" "}
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
}

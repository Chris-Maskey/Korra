"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Contact, Loader2, Search } from "lucide-react";
import { useGetProfiles } from "@/features/profiles/hooks/use-get-profiles";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { UserCard } from "@/features/profiles/components/profiles-card";
import { useDebounce } from "use-debounce";

export default function ProfilesPage() {
  const { ref, inView } = useInView();

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearch] = useDebounce(searchQuery, 500);

  const {
    data,
    error,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useGetProfiles({ searchQuery: debouncedSearch });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  if (error) {
    toast.error(error.message);
  }

  const profiles = data?.pages.flatMap((page) => page.profiles) || [];

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="flex items-center gap-2 text-4xl font-bold tracking-tight">
            Pet Lovers Community
            <Contact className="size-8 animate-bounce text-primary" />
          </h1>
          <p className="text-muted-foreground">
            Connect with fellow pet owners and animal enthusiasts
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search pet lovers..."
              className="pl-8"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <Skeleton key={index} className="h-[400px] w-full rounded-lg" />
              ))}
          </div>
        ) : profiles.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center gap-2 py-12 text-center">
            <p className="text-muted-foreground">No profiles found</p>
            <Button asChild>
              <Link href="/invite">Invite Friends</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {profiles.map((profile) => (
                <UserCard
                  key={profile.id}
                  profile={profile}
                  postCount={profile.post_count[0]?.count || 0}
                  postCountLoading={isLoading}
                />
              ))}
            </div>

            {/* Loading indicator at the bottom */}
            <div ref={ref} className="w-full text-center p-4">
              {isFetchingNextPage ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Array(3)
                    .fill(0)
                    .map((_, index) => (
                      <Skeleton
                        key={index}
                        className="h-[350px] w-full rounded-lg"
                      />
                    ))}
                </div>
              ) : hasNextPage ? (
                <p className="text-gray-500 flex items-center justify-center gap-2">
                  Loading more profiles...
                  <Loader2 className="size-4 animate-spin" />
                </p>
              ) : null}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

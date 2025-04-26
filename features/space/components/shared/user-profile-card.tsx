"use client";

import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import { cn } from "@/lib/utils";
import { Bot, Crown } from "lucide-react";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useGetFollowCounts } from "@/features/profiles/hooks/use-get-follow-counts";
import { useGetPostCounts } from "@/features/profiles/hooks/use-get-post-counts";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type UserProfileCardProps = {
  state: "expanded" | "collapsed";
  profileId?: string;
};

const SkeletonLoader = dynamic(() => import("./sidebar-header-skeleton"), {
  ssr: false,
});

export function UserProfileCard({ state, profileId }: UserProfileCardProps) {
  const { data: user, isLoading, error } = useCurrentUser();
  const { data: followCount, isLoading: followCountLoading } =
    useGetFollowCounts(user?.id || "");
  const { data: postCount, isLoading: postCountLoading } = useGetPostCounts(
    user?.id || "",
  );

  if (error) {
    toast.error(error.message);
  }

  return (
    <Card className="w-full max-w-xs">
      <CardHeader className="flex flex-col items-center space-y-4">
        <Link href={`/space/profile/${profileId}`}>
          <div
            className={cn(
              "flex items-center justify-center rounded-full group bg-muted cursor-pointer border hover:border-primary duration-500",
              state === "expanded" ? "size-32" : "size-10",
            )}
          >
            {user && user.avatar_url ? (
              <Avatar className="h-full w-full">
                <AvatarImage
                  src={user.avatar_url}
                  alt={user?.full_name || "User"}
                  width={120}
                  height={120}
                  className="rounded-full object-cover"
                />
                <AvatarFallback>
                  {user?.full_name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
            ) : (
              <Bot
                className={cn(
                  "text-primary/70 group-hover:text-primary/80 duration-500",
                  state === "expanded" ? "size-16" : "size-6",
                )}
              />
            )}
          </div>
        </Link>
        {state === "expanded" && !isLoading && (
          <div className="flex flex-col items-center justify-center text-center">
            <h3 className="text-lg flex items-center gap-2 font-semibold">
              {user?.full_name}
              {user?.role !== "BASIC" && (
                <Crown className="size-4 text-yellow-500" />
              )}
            </h3>
            <span className="text-sm text-muted-foreground font-medium">
              @{user?.user_name}
            </span>
          </div>
        )}
        {state === "expanded" && isLoading && (
          <div className="w-full">
            <SkeletonLoader />
          </div>
        )}
      </CardHeader>
      <Separator className="mb-6" />
      {state === "expanded" && (
        <>
          <CardContent>
            <div className="bg-muted w-full flex items-center justify-between p-3 rounded-md">
              <div className="w-1/3 flex flex-col items-center justify-center">
                <h3 className="text-[1rem] font-medium tracking-tight">
                  {followCountLoading
                    ? countSkeleton()
                    : followCount?.followers}
                </h3>
                <span className="text-xs text-muted-foreground">Followers</span>
              </div>
              <div className="w-1/3 flex flex-col items-center justify-center">
                <h3 className="text-[1rem] font-medium">
                  {followCountLoading
                    ? countSkeleton()
                    : followCount?.following}
                </h3>
                <span className="text-xs text-muted-foreground">Following</span>
              </div>
              <div className="w-1/3 flex flex-col items-center justify-center">
                <h3 className="text-[1rem] font-medium">
                  {postCountLoading ? countSkeleton() : postCount || 0}
                </h3>
                <span className="text-xs text-muted-foreground">Posts</span>
              </div>
            </div>
          </CardContent>
        </>
      )}
    </Card>
  );
}

const countSkeleton = () => {
  return <Skeleton className="h-6 w-6 mb-1" />;
};

"use client";

import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import { cn } from "@/lib/utils";
import { BadgeCheck, Bot, Calendar, LinkIcon, MapPin } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

type UserProfileCardProps = {
  state: "expanded" | "collapsed";
  profileId?: string;
};

const SkeletonLoader = dynamic(() => import("./sidebar-header-skeleton"), {
  ssr: false,
});

export function UserProfileCard({ state, profileId }: UserProfileCardProps) {
  const { data: user, isLoading, error } = useCurrentUser();

  if (error) {
    toast.error(error.message);
  }

  return (
    <Card className="w-full max-w-xs shadow-none">
      <CardHeader className="flex flex-col items-center space-y-4">
        <div
          className={cn(
            "flex items-center justify-center rounded-full group bg-muted cursor-pointer border hover:border-primary duration-500",
            state === "expanded" ? "size-32" : "size-10",
          )}
        >
          {user?.avatar_url ? (
            <Image
              src={user.avatar_url || "/placeholder.svg"}
              alt={`${user.full_name}'s avatar`}
              width={120}
              height={120}
              className="rounded-full"
            />
          ) : (
            <Bot
              className={cn(
                "text-primary/70 group-hover:text-primary/80 duration-500",
                state === "expanded" ? "size-16" : "size-6",
              )}
            />
          )}
        </div>
        {state === "expanded" && !isLoading && (
          <div className="flex flex-col items-center justify-center text-center">
            <h3 className="text-lg flex items-center gap-1.5 font-semibold">
              {user?.full_name}
              {user?.role !== "BASIC" && (
                <BadgeCheck className="size-5 text-yellow-500" />
              )}
            </h3>
            <span className="text-sm text-muted-foreground font-medium">
              @{user?.user_name}
            </span>
            {user?.id !== profileId && (
              <>
                <Separator className="my-2" />
                <p className="mt-2 text-sm text-center">
                  Software engineer passionate about building great user
                  experiences
                </p>
                <div className="flex flex-col items-center mt-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="size-4" /> San Francisco, CA
                  </span>
                  <span className="flex items-center gap-1">
                    <LinkIcon className="size-4" />
                    <a
                      href={""}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {"https://janedoe.dev".replace("https://", "")}
                    </a>
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="size-4" /> Joined September 2021
                  </span>
                </div>
              </>
            )}
          </div>
        )}
        {state === "expanded" && isLoading && <SkeletonLoader />}
      </CardHeader>
      <Separator className="mb-6" />
      {state === "expanded" && (
        <>
          <CardContent>
            <div className="bg-muted w-full flex items-center justify-between p-3 rounded-md">
              <div className="w-1/3 text-center">
                <h3 className="text-[0.95rem] font-medium text-center">4600</h3>
                <span className="text-xs text-muted-foreground">Followers</span>
              </div>
              <div className="w-1/3 text-center">
                <h3 className="text-[0.95rem] font-medium text-center">2600</h3>
                <span className="text-xs text-muted-foreground">Following</span>
              </div>
              <div className="w-1/3 text-center">
                <h3 className="text-[0.95rem] font-medium text-center">142</h3>
                <span className="text-xs text-muted-foreground">Posts</span>
              </div>
            </div>
          </CardContent>
          {user?.id !== profileId && (
            <CardFooter className="flex justify-center">
              <Button className="w-full">Follow</Button>
            </CardFooter>
          )}
        </>
      )}
    </Card>
  );
}

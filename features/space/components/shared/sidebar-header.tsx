"use client";

import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import { cn } from "@/lib/utils";
import { BadgeCheck, Bot } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { toast } from "sonner";

type SidebarHeaderComponent = {
  state: "expanded" | "collapsed";
};

const Skeleton = dynamic(() => import("./sidebar-header-skeleton"), {
  ssr: false,
});

export const SidebarHeaderComponent = ({ state }: SidebarHeaderComponent) => {
  const { data: user, isLoading, error } = useCurrentUser();

  if (error) {
    toast.error(error.message);
  }

  return (
    <>
      <div
        className={cn(
          "size-32 flex items-center justify-center rounded-full group bg-muted cursor-pointer border hover:border-primary duration-500",
          state === "collapsed" && "size-10",
        )}
      >
        {user?.avatar_url ? (
          <Image
            src={user?.avatar_url}
            alt="avatar"
            width={120}
            height={120}
            className="rounded-full"
          />
        ) : (
          <Bot
            className={cn(
              "size-16 text-primary/70 group-hover:text-primary/80 duration-500",
              state === "collapsed" && "size-6",
            )}
          />
        )}
      </div>
      {state === "expanded" && !isLoading && (
        <div className="flex flex-col items-center justify-center">
          <h3 className="text-lg flex items-center gap-1.5 font-semibold">
            {user?.full_name}
            {user?.role !== "BASIC" && (
              <BadgeCheck className="size-5 text-yellow-500 " />
            )}
          </h3>
          <span className="text-sm text-muted-foreground font-medium">
            @{user?.user_name}
          </span>
        </div>
      )}
      {state === "expanded" && isLoading && <Skeleton />}
      {/*TODO: Make the stats dynamic*/}
      {state === "expanded" && (
        <div className="bg-muted w-full flex items-center gap-4 p-4 rounded-md mt-4">
          <div className="w-1/3 text-center">
            <h3 className="text-[1rem] font-medium text-center">4.6k</h3>
            <span className="text-sm text-muted-foreground">Followers</span>
          </div>
          <div className="w-1/3 text-center">
            <h3 className="text-[1rem] font-medium text-center">2.6k</h3>
            <span className="text-sm text-muted-foreground">Following</span>
          </div>
          <div className="w-1/3 text-center">
            <h3 className="text-[1rem] font-medium text-center">6</h3>
            <span className="text-sm text-muted-foreground">Posts</span>
          </div>
        </div>
      )}
    </>
  );
};

"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { EllipsisIcon, HandCoins, Trash2 } from "lucide-react";
import type { Profile } from "../../../types";
import { useDeletePost } from "../../../hooks/feed/use-delete-post";
import { useEffect } from "react";
import Link from "next/link";
import { useGetDonations } from "@/features/space/hooks/feed/use-get-donation";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type PostHeaderProps = {
  postId: string;
  profiles: Profile;
  created_at: string;
  userId: string;
  setDeletePending: (value: boolean) => void;
  type: "NORMAL" | "HELP";
};

export const PostHeader = ({
  postId,
  profiles,
  created_at,
  userId,
  setDeletePending,
  type,
}: PostHeaderProps) => {
  const { mutateAsync: deletePost, isPending: deletePending } = useDeletePost();
  const { data: donation, isLoading } = useGetDonations(postId);

  useEffect(() => {
    setDeletePending(deletePending);
  }, [deletePending, setDeletePending]);

  const handleDeletePost = async () => deletePost(postId);

  // Format the money raised with 2 decimal places
  const formattedAmount = donation?.totalRaised
    ? `$${donation.totalRaised.toFixed(2)}`
    : "$0.00";

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-4">
        <Link href={`/space/profile/${profiles?.id}`}>
          <Avatar>
            <AvatarImage
              src={profiles?.avatar_url ? profiles.avatar_url : ""}
              alt={profiles?.full_name || "User"}
              className="object-cover"
            />
            <AvatarFallback>
              {profiles?.full_name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
        </Link>
        <div className="flex flex-col">
          <Link href={`/space/profile/${profiles?.id}`}>
            <span className="font-semibold">{profiles?.full_name}</span>
          </Link>
          <span className="text-sm text-gray-500">
            {formatDistanceToNow(new Date(created_at), {
              addSuffix: true,
            })}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Money raised display for HELP posts */}
        {type === "HELP" && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center">
                  {isLoading ? (
                    <Skeleton className="h-8 w-24" />
                  ) : (
                    <Badge
                      variant="outline"
                      className="bg-primary/5 hover:bg-primary/10 border-primary/20 px-3 py-1.5 h-8"
                    >
                      <HandCoins className="h-4 w-4 mr-1.5 text-primary" />
                      <span className="font-medium">{formattedAmount}</span>
                      {donation?.uniqueDonors && donation.uniqueDonors > 0 && (
                        <span className="ml-1.5 text-xs text-muted-foreground">
                          • {donation.uniqueDonors} donor
                          {donation.uniqueDonors !== 1 ? "s" : ""}
                        </span>
                      )}
                    </Badge>
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Total amount raised for this post</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        {/* Post actions dropdown */}
        <DropdownMenu>
          {profiles?.id === userId ? (
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <EllipsisIcon />
              </Button>
            </DropdownMenuTrigger>
          ) : null}
          <DropdownMenuContent className="w-44" align="end" forceMount>
            <DropdownMenuItem
              className="cursor-pointer text-xs"
              onClick={handleDeletePost}
              disabled={deletePending}
            >
              <Trash2 className="mr-1 size-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

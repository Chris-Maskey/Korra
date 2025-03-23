"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus, UserMinus, Loader2 } from "lucide-react";
import { followUser, unfollowUser } from "../actions/follow";
import { toast } from "sonner";

interface FollowButtonProps {
  userId: string;
  isFollowing: boolean | undefined;
  isCurrentUser: boolean | undefined;
}

export function FollowButton({
  userId,
  isFollowing,
  isCurrentUser,
}: FollowButtonProps) {
  const [following, setFollowing] = useState(isFollowing);
  const [loading, setLoading] = useState(false);

  if (isCurrentUser) {
    return null;
  }

  const handleFollow = async () => {
    setLoading(true);

    try {
      if (following) {
        const result = await unfollowUser(userId);
        if (result.error) {
          toast.error(result.error);
          return;
        }
        setFollowing(false);
      } else {
        const result = await followUser(userId);
        if (result.error) {
          toast.error(result.error);
          return;
        }
        setFollowing(true);
      }
    } catch (err) {
      toast.error(err as string);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button
        onClick={handleFollow}
        variant={following ? "outline" : "default"}
        size="sm"
        disabled={loading}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
        ) : following ? (
          <UserMinus className="h-4 w-4 mr-2" />
        ) : (
          <UserPlus className="h-4 w-4 mr-2" />
        )}
        {following ? "Unfollow" : "Follow"}
      </Button>
    </div>
  );
}

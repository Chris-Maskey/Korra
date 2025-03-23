"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tables } from "@/database.types";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Crown } from "lucide-react";

interface UserCardProps {
  profile: Tables<"profiles">;
  postCount: number;
}

export function UserCard({ profile, postCount }: UserCardProps) {
  const router = useRouter();
  const [isFollowing, setIsFollowing] = useState(false);
  // const [followersCount, setFollowersCount] = useState(
  //   profile.followers_count || 0,
  // );

  // const handleFollow = () => {
  //   setIsFollowing(!isFollowing);
  //   setFollowersCount(isFollowing ? followersCount - 1 : followersCount + 1);
  //   // In a real app, you would call an API to follow/unfollow the user
  // };

  // If pets aren't provided, use placeholder data
  // const posts = profile.pets || [];

  const navigateToUserProfile = (userId: string) => {
    router.push(`/space/profile/${userId}`);
  };

  if (!profile) {
    return null;
  }

  return (
    <Card className="overflow-hidden group">
      <div className="relative h-32 w-full bg-gradient-to-r from-primary/30 to-primary/10 overflow-hidden">
        {/*TODO: Add cover image*/}
        {profile.banner_url && (
          <Image
            src={profile.banner_url || "/placeholder.svg"}
            alt="Cover"
            fill
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/80"></div>
      </div>
      <CardContent className="-mt-12 p-5">
        <div className="flex flex-col items-center gap-4">
          <Avatar
            onClick={() => navigateToUserProfile(profile.id)}
            className="h-24 w-24 border-2 hover:border-primary border-background cursor-pointer duration-300"
          >
            <AvatarImage
              src={profile.avatar_url || `/placeholder.svg?height=96&width=96`}
              alt={profile.full_name!}
            />
            <AvatarFallback>
              {profile.full_name!.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col items-center gap-1 text-center">
            <Link
              href={`/space/profile/${profile.id}`}
              className="hover:underline flex items-center gap-1"
            >
              <h3 className="text-xl font-semibold">{profile.full_name}</h3>
              {profile.role === "PREMIUM" && (
                <Crown className="h-4 w-4 text-yellow-500" />
              )}
            </Link>
            <p className="text-sm text-muted-foreground">
              @{profile.user_name}
            </p>
          </div>

          <div className="flex gap-3">
            <div className="flex flex-col items-center">
              <span className="font-semibold">100</span>
              <span className="text-xs text-muted-foreground">Followers</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-semibold">100</span>
              <span className="text-xs text-muted-foreground">Following</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-semibold">{postCount}</span>
              <span className="text-xs text-muted-foreground">Posts</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between p-5 pt-0">
        <Button
          variant={isFollowing ? "outline" : "default"}
          size="sm"
          className="w-full"
        >
          {isFollowing ? "Following" : "Follow"}
        </Button>
      </CardFooter>
    </Card>
  );
}

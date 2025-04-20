import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Tables } from "@/database.types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Book,
  Calendar,
  Crown,
  LinkIcon,
  SettingsIcon,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import { FollowButton } from "./follow-button";
import { useGetFollowStatus } from "../hooks/use-get-follow-status";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetFollowCounts } from "../hooks/use-get-follow-counts";

export const ProfileHeaderCard = ({
  profile,
  postCount,
}: {
  profile: Tables<"profiles">;
  postCount: number | (number | null)[];
}) => {
  const { data: user } = useCurrentUser();
  const { data: followStatus, isLoading } = useGetFollowStatus(profile.id);
  const { data: followCount } = useGetFollowCounts(profile.id);

  return (
    <Card className="border-none shadow-md overflow-hidden">
      {/* Cover Image */}
      <div className="relative h-56 w-full bg-gradient-to-r from-primary/30 to-primary/10 overflow-hidden">
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

      <div className="relative px-6 pb-6">
        {/* Avatar */}
        <div className="-mt-16 mb-4 flex justify-between">
          <Avatar className="h-32 w-32 border border-primary shadow-lg">
            <AvatarImage
              src={profile.avatar_url || "/placeholder.svg"}
              alt={profile.full_name!}
              className="object-cover"
            />
            <AvatarFallback className="text-4xl font-medium">
              {profile.full_name!.substring(0, 1).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          {profile.id !== user?.id ? (
            isLoading ? (
              <div className="mt-[2.7rem]">
                <Skeleton className="h-8 w-24" />
              </div>
            ) : (
              <div className="mt-[2.7rem]">
                <FollowButton
                  userId={profile.id}
                  isFollowing={followStatus?.isFollowing}
                  isCurrentUser={followStatus?.isCurrentUser}
                />
              </div>
            )
          ) : (
            <Link href="/space/profile/settings">
              <Button variant={"outline"} size={"icon"} className="mt-[2.7rem]">
                <SettingsIcon />
              </Button>
            </Link>
          )}
        </div>

        {/* Profile Info */}
        <div className="space-y-4">
          <div>
            <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight">
              {profile.full_name}
              <Crown className="h-5 w-5 text-yellow-500" />
            </h1>
            <div className="flex items-center  text-muted-foreground">
              <span>@{profile.user_name}</span>
            </div>
          </div>

          {/* Bio */}

          {profile.bio && (
            <p className="text-foreground/80 mt-2">{profile.bio}</p>
          )}

          {/* Profile Meta Info */}
          <div className="flex flex-wrap gap-4 text-sm">
            {profile.created_at && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>
                  Joined{" "}
                  {new Date(profile.created_at).toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
            )}

            {profile.website && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <LinkIcon className="h-4 w-4" />
                <Link
                  href={`${profile.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline hover:text-primary transition-colors"
                >
                  {profile.website}
                </Link>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="flex gap-6 pt-2">
            <div className="flex items-center gap-1 text-sm">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="font-semibold">
                {followCount?.followers || 0}
              </span>
              <span className="text-muted-foreground">Followers</span>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="font-semibold">
                {followCount?.following || 0}
              </span>
              <span className="text-muted-foreground">Following</span>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <Book className="h-4 w-4 text-muted-foreground" />
              <span className="font-semibold">{postCount || 0}</span>
              <span className="text-muted-foreground">Posts</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

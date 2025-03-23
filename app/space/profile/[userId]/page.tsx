"use client";

import { useParams, notFound } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetProfile } from "@/features/profiles/hooks/use-get-profile";
import { useGetPostsByUserId } from "@/features/profiles/hooks/use-get-posts-by-userId";
import { PostCard } from "@/features/space/components/feed/post-card/post-card";
import { PostCardType } from "@/features/space/types";
import { AboutCard } from "@/features/profiles/components/about-card";
import { ProfileHeaderCard } from "@/features/profiles/components/profile-header-card";

export default function ProfilePage() {
  const params = useParams();
  const userId = params?.userId as string;

  const { data: profile, isLoading } = useGetProfile(userId);
  const { data: postsData, isLoading: postsLoading } =
    useGetPostsByUserId(userId);
  const posts = postsData?.pages.flatMap((page) => page.posts) || [];
  const postCount = postsData?.pages.flatMap((page) => page.count) || 0;

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (!profile) {
    return notFound();
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 ">
      <div className="flex flex-col gap-6">
        {/* Profile Header Card */}
        <ProfileHeaderCard profile={profile} postCount={postCount} />

        {/* Tabs */}
        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="posts" className="">
              Posts
            </TabsTrigger>
            <TabsTrigger value="about" className="">
              About
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="mt-6 space-y-6">
            {postsLoading ? (
              <PostsSkeleton />
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {posts.map((post) => (
                  <PostCard key={post.id} {...(post as PostCardType)} />
                ))}

                {posts.length === 0 && (
                  <Card className="flex flex-col items-center justify-center gap-2 py-16 text-center">
                    <p className="text-muted-foreground">No posts yet</p>
                  </Card>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="about" className="mt-6">
            <AboutCard profile={profile} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6 ">
      <div className="flex flex-col gap-6">
        <Card className="border-none shadow-lg overflow-hidden">
          <Skeleton className="h-56 w-full" />
          <div className="relative px-6 pb-6">
            <div className="-mt-16 mb-4 flex justify-between">
              <Skeleton className="h-32 w-32 rounded-full" />
              <Skeleton className="h-10 w-32 rounded-md mt-16" />
            </div>

            <div className="space-y-4">
              <div>
                <Skeleton className="h-8 w-64 mb-2" />
                <Skeleton className="h-5 w-40" />
              </div>

              <Skeleton className="h-6 w-full" />

              <div className="flex flex-wrap gap-4">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-5 w-40" />
              </div>

              <div className="flex gap-6 pt-2">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-24" />
              </div>
            </div>
          </div>
        </Card>

        <Skeleton className="h-12 w-full rounded-xl" />

        <div className="grid grid-cols-1 gap-6">
          <Skeleton className="h-64 w-full rounded-lg" />
          <Skeleton className="h-64 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}

function PostsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="overflow-hidden">
          <CardHeader className="p-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-5/6 mb-2" />
            <Skeleton className="h-4 w-4/6 mb-6" />
            <Skeleton className="h-64 w-full rounded-md" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

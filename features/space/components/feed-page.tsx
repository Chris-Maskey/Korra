"use client";

import { toast } from "sonner";
import { useGetPosts } from "../hooks/use-get-post";
import { Skeleton } from "@/components/ui/skeleton";
import { PostCard } from "./post-card";
// import { PostCard } from "./post-card";

export const FeedPage = () => {
  const { data: posts, isLoading, error } = useGetPosts();

  if (error) {
    toast.error(error.message);
  }

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto p-4 space-y-4">
        <Skeleton className="h-[300px] w-full rounded-lg" />
        <Skeleton className="h-[300px] w-full rounded-lg" />
        <Skeleton className="h-[300px] w-full rounded-lg" />
      </div>
    );
  }

  if (!posts) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          user={post.user}
          content={post.content}
          image={post.image_url}
          timestamp={post.created_at}
          likes={post.likes}
          comments={post.comments}
        />
      ))}
    </div>
  );
};

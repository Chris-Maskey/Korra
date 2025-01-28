"use client";

import { toast } from "sonner";
import { useGetPosts } from "../hooks/use-get-post";
import { Skeleton } from "@/components/ui/skeleton";
import { PostCard } from "./post-card";

export const FeedPage = () => {
  const { data: posts, isLoading, error } = useGetPosts();

  // Display error message if there is an error
  if (error) {
    toast.error(error.message);
  }

  // Show loading skeletons while data is being fetched
  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto p-4 space-y-4">
        <Skeleton className="h-[300px] w-full rounded-lg" />
        <Skeleton className="h-[300px] w-full rounded-lg" />
        <Skeleton className="h-[300px] w-full rounded-lg" />
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <p className="text-center text-gray-500">No posts available.</p>
      </div>
    );
  }

  // Render the list of posts
  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {posts.map((post) => (
        <PostCard key={post.id} {...post} />
      ))}
    </div>
  );
};

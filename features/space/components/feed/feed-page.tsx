// app/components/feed-page.tsx
"use client";

import { toast } from "sonner";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { useGetPosts } from "../../hooks/feed/use-get-post";
import { PostCard } from "./post-card/post-card";
import { FeedType, PostCardType } from "../../types";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

type FeedPageProps = {
  feedType: FeedType;
};

export const FeedPage = ({ feedType }: FeedPageProps) => {
  const { ref, inView } = useInView();
  const {
    data,
    error,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useGetPosts({ postType: feedType });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  if (error) {
    toast.error(error.message);
  }

  // Flatten posts from all pages
  const posts = data?.pages.flatMap((page) => page.posts) || [];

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {isLoading ? (
        <div className="max-w-2xl mx-auto p-4 space-y-4">
          <Skeleton className="h-80 w-full rounded-lg" />
          <Skeleton className="h-80 w-full rounded-lg" />
        </div>
      ) : posts.length === 0 ? (
        <div className="max-w-2xl mx-auto p-4">
          <p className="text-center text-gray-500">No posts available.</p>
        </div>
      ) : (
        <>
          {posts.map((post) => (
            <PostCard key={post.id} {...(post as PostCardType)} />
          ))}

          {/* Loading indicator at the bottom */}
          <div ref={ref} className="w-full text-center p-4">
            {isFetchingNextPage ? (
              <div className="space-y-4">
                <Skeleton className="h-[300px] w-full rounded-lg" />
                <Skeleton className="h-[300px] w-full rounded-lg" />
              </div>
            ) : hasNextPage ? (
              <p className="text-gray-500 flex items-center justify-center gap-2">
                {" "}
                <Loader2 className="size-4 animate-spin" /> Load more posts...
              </p>
            ) : null}
          </div>
        </>
      )}
    </div>
  );
};

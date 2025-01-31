"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { cn } from "@/lib/utils";

import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import { Comment, PostCardType } from "../../types";
import PostActions from "./post-interactions";
import { PostHeader } from "./post-header";
import { CommentsList, PostComment } from "./post-comments-list";
import PostCardForm from "./post-comment-form";

export function PostCard({
  id,
  content,
  image_url,
  created_at,
  profiles,
  likes,
  comments,
}: PostCardType) {
  const { data: user } = useCurrentUser();

  const [deletePending, setDeletePending] = useState<boolean>(false);

  return (
    <Card
      className={cn(
        "w-full max-w-2xl mx-auto shadow-none",
        deletePending && "opacity-50",
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between">
        <PostHeader
          postId={id}
          profiles={profiles!}
          userId={user?.id || ""}
          created_at={created_at}
          setDeletePending={setDeletePending}
        />
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="preserve-whitespace">{content}</p>
        {image_url && (
          <Image
            src={image_url}
            alt="Post content"
            className="rounded-lg w-full object-cover max-h-96"
            height={400}
            width={600}
            quality={100}
          />
        )}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{likes.length} likes</span>
          <span>{comments.length} comments</span>
        </div>
      </CardContent>
      <Separator />
      <CardFooter className="flex flex-col mt-2 gap-4">
        <PostActions
          postId={id}
          deletePending={deletePending}
          user={user}
          likes={likes}
        />
        <PostComment comments={comments} postId={id} user={user} />
      </CardFooter>
    </Card>
  );
}

"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { cn } from "@/lib/utils";

import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import { PostCardType } from "../../../types";
import PostActions from "./post-interactions";
import { PostHeader } from "./post-header";
import { PostComment } from "./post-comments-list";

export function PostCard({
  id,
  content,
  image_url,
  created_at,
  profiles,
  likes,
  comments,
  type,
}: PostCardType) {
  const { data: user } = useCurrentUser();

  const [deletePending, setDeletePending] = useState<boolean>(false);

  const [numberofComments, setNumberofComments] = useState(comments.length);

  return (
    <Card className={cn("w-full  mx-auto ", deletePending && "opacity-50")}>
      <CardHeader className="flex flex-row items-center justify-between">
        <PostHeader
          postId={id}
          profiles={profiles!}
          userId={user?.id || ""}
          created_at={created_at}
          setDeletePending={setDeletePending}
          type={type}
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
      </CardContent>
      <Separator />
      <CardFooter className="flex flex-col mt-2 gap-4">
        <PostActions
          postId={id}
          deletePending={deletePending}
          user={user}
          likes={likes}
          numberOfComments={numberofComments}
          type={type}
          postOwnerId={profiles ? profiles.id : ""}
        />
        <PostComment
          comments={comments}
          postId={id}
          user={user}
          setNumberofComments={setNumberofComments}
        />
      </CardFooter>
    </Card>
  );
}

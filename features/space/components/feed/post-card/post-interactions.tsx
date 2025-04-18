"use client";

import { Button } from "@/components/ui/button";
import { HandCoins, MessageCircle, PawPrint } from "lucide-react";
import { startTransition, useOptimistic, useState } from "react";
import { useLikePost } from "../../../hooks/feed/use-like-post";
import { Tables } from "@/database.types";
import { Like } from "../../../types";

type PostActionsProps = {
  postId: string;
  deletePending: boolean;
  user: Tables<"profiles"> | undefined;
  likes: Like[];
  numberOfComments: number;
  type: "NORMAL" | "HELP";
};

const PostActions = ({
  postId,
  deletePending,
  user,
  likes,
  numberOfComments,
  type,
}: PostActionsProps) => {
  const { mutateAsync: likePost } = useLikePost();

  const hasLiked = likes.some((like) => like.user_id === user?.id);

  const [state, setState] = useState({
    isLiked: hasLiked,
    likes: likes.length,
  });

  const [optimisticLike, addOptimisticLike] = useOptimistic(
    state,
    (prev, type: "like") => {
      if (type === "like") {
        return {
          ...prev,
          likes: prev.isLiked ? prev.likes - 1 : prev.likes + 1,
          isLiked: !prev.isLiked,
        };
      }
      return prev;
    },
  );

  const handleLikePost = async () => {
    startTransition(async () => {
      addOptimisticLike("like");

      setState((prev) => {
        return {
          ...prev,
          likes: prev.isLiked ? prev.likes - 1 : prev.likes + 1,
          isLiked: !prev.isLiked,
        };
      });
    });

    await likePost(postId);
  };

  return (
    <div className="flex justify-between w-full">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleLikePost}
        className={optimisticLike.isLiked ? "text-primary" : ""}
        disabled={deletePending}
      >
        <PawPrint className="w-5 h-5 mr-1" />
        {optimisticLike.likes} Like
      </Button>
      <Button disabled={deletePending} variant="ghost" size="sm">
        <MessageCircle className="w-5 h-5 mr-1" />
        {numberOfComments} Comment
      </Button>
      <Button
        variant="ghost"
        size="sm"
        disabled={deletePending || type === "NORMAL"}
      >
        <HandCoins className="w-5 h-5 mr-2" />
        Donate
      </Button>
    </div>
  );
};

export default PostActions;

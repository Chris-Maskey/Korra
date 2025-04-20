"use client";

import { Button } from "@/components/ui/button";
import { HandCoins, MessageCircle, PawPrint } from "lucide-react";
import { startTransition, useOptimistic, useState } from "react";
import { useLikePost } from "../../../hooks/feed/use-like-post";
import type { Tables } from "@/database.types";
import type { Like } from "../../../types";
import { useDonationModal } from "@/context/donation-modal-context";

type PostActionsProps = {
  postId: string;
  deletePending: boolean;
  user: Tables<"profiles"> | undefined;
  likes: Like[];
  numberOfComments: number;
  type: "NORMAL" | "HELP";
  postOwnerId: string; // Add this prop
};

const PostActions = ({
  postId,
  deletePending,
  user,
  likes,
  numberOfComments,
  type,
  postOwnerId,
}: PostActionsProps) => {
  const { mutateAsync: likePost } = useLikePost();
  const { openModal } = useDonationModal();

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

  const handleDonateClick = () => {
    if (user && postOwnerId !== user.id) {
      openModal(postId, postOwnerId);
    }
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
        disabled={
          deletePending || type === "NORMAL" || !user || postOwnerId === user.id
        }
        onClick={handleDonateClick}
      >
        <HandCoins className="w-5 h-5 mr-2" />
        Donate
      </Button>
    </div>
  );
};

export default PostActions;

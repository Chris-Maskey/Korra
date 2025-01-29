"use client";

import { startTransition, useOptimistic, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  Heart,
  MessageCircle,
  Send,
  HandCoins,
  EllipsisIcon,
  Trash2,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeletePost } from "../hooks/use-delete-post";
import { cn } from "@/lib/utils";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import { useLikePost } from "../hooks/use-like-post";
import { Comment, PostCardType } from "../types";

export function PostCard({
  id,
  content,
  image_url,
  created_at,
  profiles,
  likes,
  comments,
}: PostCardType) {
  const { mutateAsync, isPending: deletePending } = useDeletePost();
  const { data: user } = useCurrentUser();
  const { mutateAsync: likePost } = useLikePost();

  const [commentsList, setCommentsList] = useState<Comment[]>(comments);
  const [newComment, setNewComment] = useState<string>("");

  const likeUser = likes.some((like) => like.user_id === user?.id);

  const [optimisticLike, setOptimisticLike] = useOptimistic(
    { isLiked: likeUser, likesCount: likes.length },
    (currentState) => ({
      isLiked: !currentState.isLiked,
      likesCount: currentState.isLiked
        ? Math.max(0, currentState.likesCount - 1) // Ensure count doesn't go negative
        : currentState.likesCount + 1,
    }),
  );

  // const handleComment = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (newComment.trim()) {
  //     const comment = {
  //       id: (commentsList.length + 1).toString(),
  //       content: newComment,
  //       created_at: new Date().toISOString(),
  //       profiles: [{ full_name: profiles?.full_name, avatar_url: null }], // Replace with actual user data
  //     };
  //     setCommentsList([...commentsList, comment]);
  //     setNewComment("");
  //   }
  // };

  const deletePost = async (postId: string) => {
    await mutateAsync(postId);
  };

  const handleLikePost = async () => {
    startTransition(() => {
      setOptimisticLike(id);
    });
    await likePost(id);
  };

  return (
    <Card
      className={cn(
        "w-full max-w-2xl mx-auto shadow-none",
        deletePending && "opacity-50",
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage
              src={profiles?.avatar_url ? profiles.avatar_url : ""}
              alt={profiles?.full_name || "User"}
            />
            <AvatarFallback>
              {profiles?.full_name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-semibold">{profiles?.full_name}</span>
            <span className="text-sm text-gray-500">
              {formatDistanceToNow(new Date(created_at), {
                addSuffix: true,
              })}
            </span>
          </div>
        </div>
        <DropdownMenu>
          {profiles?.id === user?.id && (
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <EllipsisIcon />
              </Button>
            </DropdownMenuTrigger>
          )}
          <DropdownMenuContent className="w-44" align="end" forceMount>
            <DropdownMenuItem
              className="cursor-pointer text-xs"
              onClick={() => deletePost(id)}
              disabled={deletePending}
            >
              <Trash2 className="mr-1 size-1" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
          <span>{optimisticLike.likesCount} likes</span>
          <span>{commentsList.length} comments</span>
        </div>
      </CardContent>
      <Separator />
      <CardFooter className="flex flex-col mt-2 gap-4">
        <div className="flex justify-between w-full">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLikePost}
            className={optimisticLike.isLiked ? "text-rose-600" : ""}
            disabled={deletePending}
          >
            <Heart className="w-5 h-5 mr-2" />
            Like
          </Button>
          <Button disabled={deletePending} variant="ghost" size="sm">
            <MessageCircle className="w-5 h-5 mr-2" />
            Comment
          </Button>
          <Button variant="ghost" size="sm" disabled={deletePending}>
            <HandCoins className="w-5 h-5 mr-2" />
            Donate
          </Button>
        </div>
        <div className="space-y-6 w-full">
          {commentsList.map((comment: Comment) => (
            <div key={comment.id} className="flex items-start gap-2">
              <Avatar className="w-8 h-8">
                <AvatarFallback>
                  {comment.profiles?.full_name?.charAt(0) || "C"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col w-full">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm">
                    {comment.profiles?.full_name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(comment.created_at), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
                <p className="text-sm mt-1">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
        <form className="flex items-center w-full gap-2">
          <Input
            type="text"
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-grow"
          />
          <Button type="submit" size="icon" className="shrink-0">
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}

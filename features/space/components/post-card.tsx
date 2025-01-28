"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  Heart,
  MessageCircle,
  Send,
  HandCoins,
  EllipsisIcon,
  Pencil,
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

// Define the PostCardProps type as a single object
type PostCardProps = {
  id: string;
  content: string;
  image_url: string | null;
  created_at: string | null;
  profiles: {
    full_name: string | null;
    avatar_url: string | null;
  }; // Ensure this is an array
  likes: {
    count: number;
  }; // This should be a single object
  comments: {
    id: string;
    content: string;
    created_at: string;
    profiles: {
      full_name: string | null;
      avatar_url: string | null;
    }[];
  }[];
};

export function PostCard({
  content,
  image_url,
  created_at,
  profiles,
  likes,
  comments,
}: any) {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(likes.count || 0); // Access count directly
  const [commentsList, setCommentsList] = useState(comments);
  const [newComment, setNewComment] = useState("");

  const handleLike = () => {
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
    setIsLiked(!isLiked);
  };

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      const comment = {
        id: (commentsList.length + 1).toString(),
        content: newComment,
        created_at: new Date().toISOString(),
        profiles: [{ full_name: "Current User", avatar_url: null }], // Replace with actual user data
      };
      setCommentsList([...commentsList, comment]);
      setNewComment("");
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-none">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage
              src={profiles?.avatar_url || "/default-avatar.png"}
              alt={profiles?.full_name || "User"}
            />
            <AvatarFallback>
              {profiles?.full_name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-semibold">{profiles?.full_name}</span>
            <span className="text-sm text-gray-500">
              {formatDistanceToNow(new Date(created_at!.toString()), {
                addSuffix: true,
              })}
            </span>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <EllipsisIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-44" align="end" forceMount>
            <DropdownMenuItem className="cursor-pointer text-xs">
              <Pencil className="mr-1 size-1" />
              <span>Edit</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer text-xs">
              <Trash2 className="mr-1 size-1" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>{content}</p>
        {image_url ? (
          <Image
            src={image_url}
            alt="Post content"
            className="rounded-lg w-full object-cover max-h-96"
            height={400}
            width={600}
            quality={100}
          />
        ) : (
          <div className="flex items-center justify-center w-full min-h-96 h-full text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 animate-spin text-rose-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
          </div>
        )}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{likesCount} likes</span>
          <span>{commentsList.length} comments</span>
        </div>
      </CardContent>
      <Separator />
      <CardFooter className="flex flex-col mt-2 gap-4">
        <div className="flex justify-between w-full">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            className={isLiked ? "text-rose-600" : ""}
          >
            <Heart className="w-5 h-5 mr-2" />
            Like
          </Button>
          <Button variant="ghost" size="sm">
            <MessageCircle className="w-5 h-5 mr-2" />
            Comment
          </Button>
          <Button variant="ghost" size="sm">
            <HandCoins className="w-5 h-5 mr-2" />
            Donate
          </Button>
        </div>
        <div className="space-y-6 w-full">
          {commentsList.map((comment) => (
            <div key={comment.id} className="flex items-start gap-2">
              <Avatar className="w-8 h-8">
                <AvatarFallback>
                  {comment.profiles[0]?.full_name?.charAt(0) || "C"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col w-full">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm">
                    {comment.profiles[0]?.full_name}
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
        <form
          onSubmit={handleComment}
          className="flex items-center w-full gap-2"
        >
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

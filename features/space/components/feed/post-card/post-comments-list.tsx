import * as z from "zod";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Comment } from "../../../types";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { commentSchema } from "../../../schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useCreateComment } from "../../../hooks/feed/use-create-comment";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Maximize2, Send } from "lucide-react";
import { startTransition, useOptimistic, useState } from "react";
import { Tables } from "@/database.types";

type PostCommentProps = {
  comments: Comment[];
  postId: string;
  user: Tables<"profiles"> | undefined;
  setNumberofComments: (number: number) => void;
};

type CommentSchemaType = z.infer<typeof commentSchema>;

export const PostComment = ({
  comments,
  postId,
  user,
  setNumberofComments,
}: PostCommentProps) => {
  const { mutateAsync: createPost, isPending } = useCreateComment(postId);

  const form = useForm<CommentSchemaType>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      content: "",
    },
  });

  const [state, setState] = useState({
    comments: comments.length > 3 ? comments.slice(0, 3) : comments,
    commentsCount: comments.length,
  });

  const [optimisticComments, setOptimisticComments] = useOptimistic(
    state,
    (prev, action: { comment: Comment }) => {
      return {
        ...prev,
        comments: [action.comment, ...prev.comments],
        commentsCount: prev.commentsCount + 1,
      };
    },
  );

  const handleSubmit = async (data: CommentSchemaType) => {
    const optimisticComment = {
      id: crypto.randomUUID(),
      content: data.content,
      profiles: {
        id: user?.id || "",
        avatar_url: user?.avatar_url || "",
        full_name: user?.full_name || "",
      },
      created_at: new Date().toISOString(),
    };

    startTransition(async () => {
      setOptimisticComments({ comment: optimisticComment });

      setState((prev) => {
        return {
          ...prev,
          comments: [optimisticComment, ...prev.comments],
          commentsCount: prev.commentsCount + 1,
        };
      });

      setNumberofComments(state.commentsCount + 1);
    });
    form.reset();
    await createPost(data);
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex items-center w-full gap-2"
        >
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem className="flex-grow">
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Write a comment"
                    {...field}
                    className="flex-grow"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            size="icon"
            disabled={isPending}
            className="shrink-0"
          >
            {isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </form>
      </Form>
      {optimisticComments.comments.length > 0 && (
        <div className="space-y-6 w-full">
          {optimisticComments.comments.map((comment: Comment) => (
            <div key={comment.id} className="flex items-start gap-2">
              <Avatar className="w-8 h-8">
                <AvatarImage
                  src={comment.profiles?.avatar_url || ""}
                  alt={comment.profiles?.full_name || "User"}
                />
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
          {comments.length > 3 && (
            <Button
              type="button"
              size={"sm"}
              variant={"ghost"}
              className="text-xs flex items-center gap-2 w-full"
            >
              <Maximize2 />
              View all comments
            </Button>
          )}
        </div>
      )}
    </>
  );
};

import * as z from "zod";
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
import { Send } from "lucide-react";

type PostCardFormProps = {
  postId: string;
  userId: string;
};

type CommentSchemaType = z.infer<typeof commentSchema>;

const PostCardForm = ({ postId }: PostCardFormProps) => {
  const { mutateAsync: createPost } = useCreateComment(postId);

  const form = useForm<CommentSchemaType>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      content: "",
    },
  });

  const handleSubmit = async (data: CommentSchemaType) => {
    await createPost(data);
  };

  return (
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
        <Button type="submit" size="icon" className="shrink-0">
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </Form>
  );
};

export default PostCardForm;

"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ImagePlus, Loader2, Send, X } from "lucide-react";
import * as z from "zod";
import { postSchema } from "../schema";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useCreatePost } from "../hooks/use-create-post";

type PostSchemaType = z.infer<typeof postSchema>;

export function CreatePost() {
  const { mutateAsync, isPending } = useCreatePost();

  const form = useForm<PostSchemaType>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      content: "",
      image: undefined,
    },
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    form.setValue("image", file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const createPost = async (formData: PostSchemaType) => {
    mutateAsync(formData).then(() => {
      form.reset();
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-none">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(createPost)}>
          <CardContent className="p-4 space-y-4">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="What's on your mind?"
                      {...field}
                      disabled={isPending}
                      className="whitespace-pre-wrap"
                      rows={5}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="image"
              render={() => (
                <input
                  ref={fileInputRef}
                  type="file"
                  name="image"
                  accept="image/*"
                  disabled={isPending}
                  onChange={handleImageChange}
                  className="hidden"
                />
              )}
            />
            {imagePreview && (
              <div className="relative w-full h-64 mb-4">
                <Image
                  src={imagePreview || "/placeholder.svg"}
                  alt="Preview"
                  fill
                  className="object-cover rounded-md"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={() => setImagePreview(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isPending}
            >
              <ImagePlus className="mr-2 h-4 w-4" /> Add Image
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <Loader2 className="animate-spin size-4" />
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" /> Post
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

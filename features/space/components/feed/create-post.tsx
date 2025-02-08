"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ImagePlus, Loader2, Send, X } from "lucide-react";
import * as z from "zod";
import { postSchema } from "../../schema";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useCreatePost } from "../../hooks/feed/use-create-post";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { TooltipContent } from "@/components/ui/tooltip";

type PostSchemaType = z.infer<typeof postSchema>;

export function CreatePost() {
  const form = useForm<PostSchemaType>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      content: "",
      image: undefined,
      type: "NORMAL",
    },
  });

  const { mutateAsync, isPending } = useCreatePost({
    feedType: form.getValues("type"),
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
    <Card className="w-full max-w-2xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(createPost)}>
          <CardContent className="p-4 space-y-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="flex items-center justify-end space-x-2">
                  <FormControl>
                    <div className="flex text-xs items-center space-x-2">
                      <TooltipProvider>
                        <Tooltip>
                          <Switch
                            id="post-type-toggle"
                            checked={field.value === "HELP"}
                            onCheckedChange={(checked) =>
                              field.onChange(checked ? "HELP" : "NORMAL")
                            }
                          />
                          <TooltipTrigger asChild>
                            <Label
                              htmlFor="post-type-toggle"
                              className="text-xs"
                            >
                              Rescue{" "}
                            </Label>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Toggle to create a rescue & support post</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                      rows={3}
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

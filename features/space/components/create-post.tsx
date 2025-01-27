"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ImagePlus, Send, X } from "lucide-react";

export function CreatePost() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (formData: FormData) => {
    console.log(formData);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-none">
      <form ref={formRef} action={handleSubmit}>
        <CardContent className="p-4">
          <Textarea
            name="caption"
            placeholder="What's on your mind?"
            className="min-h-[100px] mb-4"
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
          <input
            ref={fileInputRef}
            type="file"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
          >
            <ImagePlus className="mr-2 h-4 w-4" /> Add Image
          </Button>
          <Button type="submit">
            <Send className="mr-2 h-4 w-4" /> Post
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

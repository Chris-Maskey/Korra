"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, SendHorizontal, Smile, X, FileIcon } from "lucide-react";
import type * as z from "zod";
import { messageSchema } from "../../schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { createMessage } from "../../actions/chat/create-message";

type MessageSchemaType = z.infer<typeof messageSchema>;

type ChatInputProps = {
  recipientId: string;
};

const ChatInput = ({ recipientId }: ChatInputProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const form = useForm<MessageSchemaType>({
    defaultValues: {
      content: "",
      attachment: undefined,
    },
    resolver: zodResolver(messageSchema),
  });

  const onSubmit = async (data: MessageSchemaType) => {
    try {
      await createMessage(data, recipientId);

      form.reset();
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    }
  };

  const handleFileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        e.target.value = "";
        return;
      }
      setSelectedFile(file);
      form.setValue("attachment", file);
    } else {
      setSelectedFile(null);
      form.setValue("attachment", undefined);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    form.setValue("attachment", undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex items-center w-full space-x-2">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex items-center w-full space-x-2"
        >
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 flex-shrink-0"
            type="button"
            onClick={handleFileClick}
          >
            <Plus className="h-5 w-5" />
            <span className="sr-only">Add attachment</span>
          </Button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*, .pdf, .doc, .docx"
            className="hidden"
            aria-label="Upload file"
          />

          <div className="flex-1 flex items-center space-x-2 bg-muted rounded-xl px-4 py-2">
            <div className="flex-1 flex flex-col w-full">
              {selectedFile && (
                <div className="flex items-center mb-1 bg-primary/10 text-primary rounded-md px-2 py-1 text-xs">
                  <FileIcon className="h-3 w-3 mr-1 flex-shrink-0" />
                  <span className="truncate max-w-[200px]">
                    {selectedFile.name}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 ml-1 flex-shrink-0"
                    type="button"
                    onClick={removeFile}
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">Remove file</span>
                  </Button>
                </div>
              )}

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder={
                          selectedFile
                            ? "Add a message or send file"
                            : "Type a new message"
                        }
                        className="flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex items-center space-x-2 flex-shrink-0">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                type="button"
              >
                <Smile className="h-4 w-4" />
                <span className="sr-only">Add emoji</span>
              </Button>
              <Button
                variant="default"
                size="icon"
                className="h-8 w-8"
                type="submit"
                disabled={
                  (!form.watch("content") && !selectedFile) ||
                  form.formState.isSubmitting
                }
              >
                <SendHorizontal className="h-4 w-4" />
                <span className="sr-only">Send message</span>
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ChatInput;

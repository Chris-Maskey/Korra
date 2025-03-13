"use client";

import { useCallback, useEffect, useRef, useState, useMemo, memo } from "react";
import {
  Menu,
  Check,
  EllipsisVertical,
  MessagesSquare,
  Loader2,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useGetUsers } from "@/features/space/hooks/shared/use-get-users";
import { User } from "@/features/space/types";
import { ChatSidebar } from "@/features/space/components/chat/chat-sidebar";
import ChatInput from "@/features/space/components/chat/chat-input";
import { createClient } from "@/lib/supabase/client";
import { RealtimeChannel } from "@supabase/supabase-js";
import { Tables } from "@/database.types";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useGetMessages } from "@/features/space/hooks/chat/use-get-messages";
import { useQueryClient } from "@tanstack/react-query";

interface MessageItemProps {
  message: Tables<"messages">;
  isCurrentUser: boolean;
  selectedUser: User;
  userId: string;
}

const MessageItem = memo(
  ({ message, isCurrentUser, selectedUser }: MessageItemProps) => {
    const timestamp = format(new Date(message.created_at as string), "HH:mm");

    return (
      <div
        className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
      >
        {!isCurrentUser && (
          <Avatar className="h-8 w-8 mr-2">
            <AvatarImage src={selectedUser.avatar_url ?? undefined} />
            <AvatarFallback>{selectedUser.full_name?.[0]}</AvatarFallback>
          </Avatar>
        )}
        <div className={`max-w-[70%] ${!isCurrentUser ? "ml-2" : ""}`}>
          <div
            className={`${message.attachment_url ? "rounded-sm" : "rounded-2xl"} px-4 py-2 ${
              isCurrentUser ? "bg-primary text-primary-foreground" : "bg-muted"
            }`}
          >
            {message.attachment_url && (
              <div className="flex items-center gap-2 mb-4 ">
                <Image
                  src={message.attachment_url}
                  alt="Attachment"
                  width={500}
                  height={300}
                  className="w-full h-auto rounded-sm"
                />
              </div>
            )}
            {message.content && <p className="text-sm">{message.content}</p>}
          </div>
          <div
            className={cn(
              `flex items-center gap-2 mt-1`,
              isCurrentUser ? "justify-end" : "justify-start",
            )}
          >
            <span className="text-xs text-muted-foreground">{timestamp}</span>
            {isCurrentUser && message.is_read && (
              <Check className="h-3 w-3 text-primary" />
            )}
          </div>
        </div>
      </div>
    );
  },
);
MessageItem.displayName = "MessageItem";

export default function ChatWindow() {
  const supabase = createClient();
  const queryClient = useQueryClient();
  const { data: users, isLoading } = useGetUsers();
  const [selectedUser, setSelectedUser] = useState<User | undefined>();
  const { data: messages, isLoading: messagesLoading } = useGetMessages(
    selectedUser ? selectedUser.id : "",
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const setupRealtimeSubscription = useCallback(
    async (recipientId: string) => {
      if (!userId || !recipientId) return;

      const channelName = `messages:${userId}-${recipientId}`;
      const channel = supabase
        .channel(channelName)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "messages",
          },
          (payload) => {
            const newMessage = payload.new as Tables<"messages">;
            //NOTE: This is a bit wacky way to check if the message is relevant to the current user
            const isRelevantMessage =
              (newMessage.recipient_id === userId &&
                newMessage.sender_id === recipientId) ||
              (newMessage.sender_id === userId &&
                newMessage.recipient_id === recipientId);

            if (isRelevantMessage) {
              queryClient.setQueryData(
                ["messages", recipientId],
                (old: Tables<"messages">[] | undefined) =>
                  old ? [...old, newMessage] : [newMessage],
              );
            }
          },
        )
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "messages",
          },
          (payload) => {
            const updatedMessage = payload.new as Tables<"messages">;
            //NOTE: This is a bit wacky way to check if the message is relevant to the current user
            const isRelevantMessage =
              (updatedMessage.recipient_id === userId &&
                updatedMessage.sender_id === recipientId) ||
              (updatedMessage.sender_id === userId &&
                updatedMessage.recipient_id === recipientId);

            if (isRelevantMessage) {
              queryClient.setQueryData(
                ["messages", recipientId],
                (old: Tables<"messages">[] | undefined) =>
                  old?.map((msg) =>
                    msg.id === updatedMessage.id ? updatedMessage : msg,
                  ),
              );
            }
          },
        )
        .subscribe();

      channelRef.current = channel;
      return () => {
        channel.unsubscribe();
      };
    },
    [userId, supabase, queryClient],
  );

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUserId(user?.id ?? null);
    };
    fetchUser();
  }, [supabase.auth]);

  useEffect(() => {
    if (!selectedUser?.id) return;
    const initializeChat = async () => {
      await setupRealtimeSubscription(selectedUser.id);
    };
    initializeChat();
    return () => {
      channelRef.current?.unsubscribe();
    };
  }, [selectedUser?.id, setupRealtimeSubscription]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleUserSelect = useCallback((data: User) => {
    setSelectedUser(data);
  }, []);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  const memoizedUsers = useMemo(() => users ?? [], [users]);

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-background">
      <ChatSidebar
        users={memoizedUsers}
        isLoading={isLoading}
        selectedUser={selectedUser}
        setSelectedUserAction={handleUserSelect}
        isSidebarOpen={isSidebarOpen}
      />

      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={toggleSidebar}
                    aria-label="Toggle sidebar"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={selectedUser.avatar_url ?? undefined} />
                      <AvatarFallback>
                        {selectedUser.full_name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-semibold text-foreground">
                      {selectedUser.full_name}
                    </span>
                  </div>
                </div>
                <Button variant="ghost" size="icon" aria-label="More options">
                  <EllipsisVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messagesLoading && (
                <div className="w-full h-full flex items-center justify-center">
                  <Loader2 className="animate-spin" />
                </div>
              )}

              {!messagesLoading && !messages?.length && (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-muted-foreground">No messages yet</span>
                </div>
              )}

              {userId &&
                messages?.map((message) => (
                  <MessageItem
                    key={message.id}
                    message={message}
                    isCurrentUser={message.sender_id === userId}
                    selectedUser={selectedUser}
                    userId={userId}
                  />
                ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-border">
              <ChatInput recipientId={selectedUser.id} />
            </div>
          </>
        ) : (
          <div className="flex flex-col gap-3 items-center justify-center h-full">
            <MessagesSquare className="size-44 text-primary animate-bounce" />
            <p className="text-lg font-medium text-muted-foreground">
              Select a chat to start a conversation
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

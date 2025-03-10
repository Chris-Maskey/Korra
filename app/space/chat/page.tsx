"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Menu, Check, EllipsisVertical, MessagesSquare } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useGetUsers } from "@/features/space/hooks/shared/use-get-users";
import { User } from "@/features/space/types";
import { ChatSidebar } from "@/features/space/components/chat/chat-sidebar";
import ChatInput from "@/features/space/components/chat/chat-input";
import { createClient } from "@/lib/supabase/client";
import { getMessages } from "@/features/space/actions/chat/get-messages";
import { RealtimeChannel } from "@supabase/supabase-js";
import { Tables } from "@/database.types";
import { format } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function ChatWindow() {
  const supabase = createClient();
  const { data: users, isLoading } = useGetUsers();
  const [selectedUser, setSelectedUser] = useState<User | undefined>();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [messages, setMessages] = useState<Tables<"messages">[]>([]);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const fetchMessages = useCallback(async (recipientId: string) => {
    try {
      const messages = await getMessages(recipientId);
      setMessages(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to load messages");
    }
  }, []);

  const setupRealtimeSubscription = useCallback(
    async (recipientId: string) => {
      if (!userId || !recipientId) return;

      const channelName = `messages:${userId}-${recipientId}`;
      supabase
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
            setMessages((prev) => {
              if (prev.find((msg) => msg.id === newMessage.id)) {
                return prev;
              }
              return [...prev, newMessage];
            });
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
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === updatedMessage.id ? updatedMessage : msg,
              ),
            );
          },
        )
        .subscribe();

      return () => {
        if (channelRef.current) {
          channelRef.current.unsubscribe();
          channelRef.current = null;
        }
      };
    },
    [userId, supabase],
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
      await fetchMessages(selectedUser.id);
      await setupRealtimeSubscription(selectedUser.id);
    };

    initializeChat();

    return () => {
      if (channelRef.current) {
        channelRef.current.unsubscribe();
        channelRef.current = null;
      }
    };
  }, [selectedUser?.id, fetchMessages, setupRealtimeSubscription]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-background">
      <ChatSidebar
        users={users ?? []}
        isLoading={isLoading}
        selectedUser={selectedUser}
        setSelectedUserAction={setSelectedUser}
        isSidebarOpen={isSidebarOpen}
      />

      {/* Main Chat Area */}
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
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
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
              {userId &&
                messages.map((message) => {
                  const isCurrentUser = message.sender_id === userId;
                  const timestamp = format(
                    new Date(message.created_at as string),
                    "HH:mm",
                  );

                  return (
                    <div
                      key={message.id}
                      className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
                    >
                      {!isCurrentUser && (
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarImage
                            src={selectedUser.avatar_url ?? undefined}
                          />
                          <AvatarFallback>
                            {selectedUser.full_name?.[0]}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={`max-w-[70%] ${!isCurrentUser ? "ml-2" : ""}`}
                      >
                        <div
                          className={`${message.attachment_url ? "rounded-sm" : "rounded-2xl"} px-4 py-2 ${
                            isCurrentUser
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
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
                          {message.content && (
                            <p className="text-sm">{message.content}</p>
                          )}
                        </div>
                        <div
                          className={cn(
                            `flex items-center gap-2 mt-1`,
                            isCurrentUser ? "justify-end" : "justify-start",
                          )}
                        >
                          <span className="text-xs text-muted-foreground">
                            {timestamp}
                          </span>
                          {isCurrentUser && message.is_read && (
                            <Check className="h-3 w-3 text-primary" />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
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

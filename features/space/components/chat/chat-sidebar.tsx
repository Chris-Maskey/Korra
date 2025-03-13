"use client";

import { Button } from "@/components/ui/button";
import { User } from "../../types";
import { Loader2, Search, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ChatSidebarUser } from "./chat-sidebar-user";

type ChatSidebarProps = {
  users: User[] | undefined;
  isLoading: boolean;
  selectedUser: User | undefined;
  setSelectedUserAction: (user: User) => void;
  isSidebarOpen: boolean;
};

export const ChatSidebar = ({
  users,
  isLoading,
  selectedUser,
  setSelectedUserAction,
  isSidebarOpen,
}: ChatSidebarProps) => {
  return (
    <div
      className={cn(
        "w-80 border-r border-border flex flex-col min-h-[calc(100vh-1rem]",
        !isSidebarOpen && "hidden",
      )}
    >
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground">Chats</h2>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search" className="pl-9" />
        </div>
      </div>
      <div className="flex-1 w-80 overflow-y-auto">
        {!users || isLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <Loader2 className="size-4 animate-spin" />
          </div>
        ) : (
          users?.map((user) => (
            <div
              key={user.id}
              className={`flex items-center p-4 cursor-pointer hover:bg-accent group ${
                selectedUser?.id === user.id ? "bg-accent" : ""
              }`}
              onClick={() => setSelectedUserAction(user)}
            >
              <ChatSidebarUser user={user} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

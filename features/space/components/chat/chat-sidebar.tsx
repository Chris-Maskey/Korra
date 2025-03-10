"use client";

import { Button } from "@/components/ui/button";
import { User } from "../../types";
import { Loader2, Search, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { cn } from "@/lib/utils";

type ChatSidebarProps = {
  users: User[] | undefined;
  isLoading: boolean;
  selectedUser: User | undefined;
  setSelectedUserAction: (user: User) => void;
  isSidebarOpen: boolean;
  lastMessage?: string | null;
};

export const ChatSidebar = ({
  users,
  isLoading,
  selectedUser,
  setSelectedUserAction,
  isSidebarOpen,
  lastMessage,
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
              <div className="h-10 w-10 bg-gray-50 rounded-full flex items-center justify-center mr-3 border flex-shrink-0 overflow-hidden">
                {user.avatar_url ? (
                  <Image
                    src={user.avatar_url}
                    width={40}
                    height={40}
                    alt={`${user.full_name}'s avatar`}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <span className="text-lg dark:text-slate-700">
                    {user.full_name?.charAt(0)}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-medium truncate text-foreground">
                    {user.full_name}
                  </h3>
                  <span className="bg-primary text-primary-foreground text-xs rounded-full size-2 ml-2 flex items-center justify-center"></span>
                </div>
                {/*TODO: add last message*/}
                {/* <p className="text-sm text-muted-foreground truncate"> */}
                {/*   {group.lastMessage} */}
                {/* </p> */}
                <p className="text-sm text-muted-foreground truncate">
                  {lastMessage}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

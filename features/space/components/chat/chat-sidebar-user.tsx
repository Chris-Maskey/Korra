import Image from "next/image";
import { useGetLatestMessage } from "../../hooks/chat/use-get-latest-message";
import { User } from "../../types";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect } from "react";

type ChatSidebarUserProps = {
  user: User;
};

export const ChatSidebarUser = ({ user }: ChatSidebarUserProps) => {
  const { data: lastMessage, isLoading } = useGetLatestMessage(user.id);

  useEffect(() => {});

  return (
    <>
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
          {/*TODO: Add badge for unread messages*/}
          {/* <span className="bg-primary text-primary-foreground text-xs rounded-full size-2 ml-2 flex items-center justify-center"></span> */}
        </div>
        {isLoading ? (
          <Skeleton className="h-4 w-3/4" />
        ) : (
          <p className="text-sm text-muted-foreground truncate">
            {lastMessage &&
              lastMessage.attachment_url &&
              !lastMessage.content &&
              "📎 sent an attachment"}
            {lastMessage ? lastMessage.content : "No messages yet"}
          </p>
        )}
      </div>
    </>
  );
};

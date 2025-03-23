import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { EllipsisIcon, Trash2 } from "lucide-react";
import { Profile } from "../../../types";
import { useDeletePost } from "../../../hooks/feed/use-delete-post";
import { useEffect } from "react";
import Link from "next/link";

type PostHeaderProps = {
  postId: string;
  profiles: Profile;
  created_at: string;
  userId: string;
  setDeletePending: (value: boolean) => void;
};

export const PostHeader = ({
  postId,
  profiles,
  created_at,
  userId,
  setDeletePending,
}: PostHeaderProps) => {
  const { mutateAsync: deletePost, isPending: deletePending } = useDeletePost();

  useEffect(() => {
    setDeletePending(deletePending);
  }, [deletePending, setDeletePending]);

  const handleDeletePost = async () => deletePost(postId);

  return (
    <>
      <div className="flex items-center gap-4">
        <Link href={`/space/profile/${profiles?.id}`}>
          <Avatar>
            <AvatarImage
              src={profiles?.avatar_url ? profiles.avatar_url : ""}
              alt={profiles?.full_name || "User"}
            />
            <AvatarFallback>
              {profiles?.full_name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
        </Link>
        <div className="flex flex-col">
          <Link href={`/space/profile/${profiles?.id}`}>
            <span className="font-semibold">{profiles?.full_name}</span>
          </Link>
          <span className="text-sm text-gray-500">
            {formatDistanceToNow(new Date(created_at), {
              addSuffix: true,
            })}
          </span>
        </div>
      </div>
      <DropdownMenu>
        {profiles?.id === userId && (
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <EllipsisIcon />
            </Button>
          </DropdownMenuTrigger>
        )}
        <DropdownMenuContent className="w-44" align="end" forceMount>
          <DropdownMenuItem
            className="cursor-pointer text-xs"
            onClick={handleDeletePost}
            disabled={deletePending}
          >
            <Trash2 className="mr-1 size-1" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

"use client";

import Image from "next/image";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { EllipsisIcon, MessageCircle, Share, Trash2 } from "lucide-react";
import { AdoptionPost } from "../../types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteAdoptionPost } from "../../hooks/adoption/use-delete-adoption-post";
import { cn } from "@/lib/utils";

type AdoptionCardProps = {
  adoption: AdoptionPost;
  userId: string | undefined;
};

const AdoptionCard = ({ adoption, userId }: AdoptionCardProps) => {
  const { mutateAsync: deleteAdoptionPost, isPending: deletePending } =
    useDeleteAdoptionPost();

  const handleDelete = async () => {
    await deleteAdoptionPost(adoption.id);
  };

  return (
    <Card className={cn(deletePending && "opacity-50")}>
      <CardHeader className="p-0">
        <Image
          src={adoption.image_url}
          alt={adoption.pet_name}
          width={400}
          height={300}
          className="object-cover h-48 w-full rounded-t-lg"
        />
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">{adoption.pet_name}</h3>
            <p className="text-sm text-muted-foreground">
              {adoption.pet_type} • {adoption.pet_age} {adoption.pet_age_unit}
            </p>
          </div>
          <DropdownMenu>
            {adoption?.user_id === userId && (
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <EllipsisIcon />
                </Button>
              </DropdownMenuTrigger>
            )}
            <DropdownMenuContent className="w-44" align="end" forceMount>
              <DropdownMenuItem
                className="cursor-pointer text-xs"
                onClick={handleDelete}
                disabled={deletePending}
              >
                <Trash2 className="mr-1 size-1" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <p className="mt-2 text-sm line-clamp-2 h-10">
          {adoption.pet_description}
        </p>
      </CardContent>
      {adoption?.user_id !== userId && (
        <CardFooter className="p-4 pt-0 flex gap-2">
          <Button className="flex-1" disabled={deletePending}>
            <MessageCircle className="w-4 h-4 mr-2" />
            Connect
          </Button>
          <Button variant="outline" size="icon" disabled={deletePending}>
            <Share className="w-4 h-4" />
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default AdoptionCard;

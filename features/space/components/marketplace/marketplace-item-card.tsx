"use client";

import Image from "next/image";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { EllipsisIcon, Share, ShoppingBag, Trash2 } from "lucide-react";
import { MarketplaceItem } from "../../types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useDeleteMarketplaceItem } from "../../hooks/marketplace/use-delete-marketplace-item";
import Link from "next/link";
import { toast } from "sonner";

type MarketplaceItemCardProps = {
  marketplaceItem: MarketplaceItem;
  userId: string | undefined;
};

const getCurrencySymbol = (currency: string) => {
  switch (currency) {
    case "USD":
      return "$";
    case "EUR":
      return "€";
    case "GBP":
      return "£";
    case "JPY":
      return "¥";
    case "NPR":
      return "रू";
    default:
      return "$";
  }
};

const MarketplaceItemCard = ({
  marketplaceItem,
  userId,
}: MarketplaceItemCardProps) => {
  const { mutateAsync: deleteMarketplaceItem, isPending: deletePending } =
    useDeleteMarketplaceItem();

  const handleDelete = async () => {
    await deleteMarketplaceItem(marketplaceItem.id);
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(
      `${process.env.NEXT_PUBLIC_APP_URL}/space/marketplace/${marketplaceItem.id}`,
    );
    toast.success("Link copied to clipboard");
  };

  return (
    <Card className={cn(deletePending && "opacity-50")}>
      <CardHeader className="p-0">
        <Image
          src={marketplaceItem.image_url}
          alt={marketplaceItem.item_name}
          width={400}
          height={300}
          className="object-cover h-48 w-full rounded-t-lg"
        />
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <Link href={`/marketplace/${marketplaceItem.id}`}>
              <h3 className="font-semibold text-lg">
                {marketplaceItem.item_name}
              </h3>
            </Link>
            <p className="text-sm text-muted-foreground">
              {marketplaceItem.item_type} •{" "}
              {getCurrencySymbol(marketplaceItem.currency!)}
              {marketplaceItem.item_price}
            </p>
          </div>
          <DropdownMenu>
            {marketplaceItem?.user_id === userId && (
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
          {marketplaceItem.item_description}
        </p>
      </CardContent>
      {marketplaceItem?.user_id !== userId && (
        <CardFooter className="p-4 pt-0 flex gap-2">
          <Link
            href={`/space/marketplace/${marketplaceItem.id}`}
            className="w-full"
          >
            <Button className="flex-1 w-full" disabled={deletePending}>
              <ShoppingBag className="w-4 h-4" />
              Buy Now
            </Button>
          </Link>
          <Button
            onClick={copyToClipboard}
            variant="outline"
            size="icon"
            disabled={deletePending}
          >
            <Share className="w-4 h-4" />
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default MarketplaceItemCard;

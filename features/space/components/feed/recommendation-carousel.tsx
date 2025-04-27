"use client";
import * as React from "react";
import Image from "next/image";
import {
  Star,
  Users,
  Award,
  PawPrintIcon as Paw,
  Loader2,
  Crown,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import Autoplay from "embla-carousel-autoplay";
import { useFeedRecommendations } from "../../hooks/feed/use-recommendation";
import type { Tables } from "@/database.types";
import { useRouter } from "next/navigation";

// --- Type Definitions ---
type MostFollowedData = Tables<"profiles"> & {
  followersCount: number;
};

type HighestRatedData = Tables<"marketplace">;

type AvailablePetData = Tables<"adoption">;

type FeedRecommendationsData = {
  mostFollowed: MostFollowedData | null;
  highestRated: HighestRatedData | null;
  availablePets: AvailablePetData | null;
};

type MostFollowedRecommendation = MostFollowedData & {
  type: "mostFollowed";
  tag: "Most Followed";
};

type HighestRatedRecommendation = HighestRatedData & {
  type: "highestRated";
  tag: "Highest Rated";
};

type AvailablePetRecommendation = AvailablePetData & {
  type: "availablePet";
  tag: "Available Pet";
};

type RecommendationItem =
  | MostFollowedRecommendation
  | HighestRatedRecommendation
  | AvailablePetRecommendation;

export function RecommendationCarousel() {
  const { data, isLoading } = useFeedRecommendations() as {
    data: FeedRecommendationsData | undefined;
    isLoading: boolean;
  };

  const router = useRouter();

  const recommendations = React.useMemo(() => {
    const items: RecommendationItem[] = [];

    if (data?.mostFollowed) {
      items.push({
        ...data.mostFollowed,
        type: "mostFollowed",
        tag: "Most Followed",
      });
    }

    if (data?.highestRated) {
      items.push({
        ...data.highestRated,
        type: "highestRated",
        tag: "Highest Rated",
      });
    }

    if (data?.availablePets) {
      items.push({
        ...data.availablePets,
        type: "availablePet",
        tag: "Available Pet",
      });
    }

    return items;
  }, [data]);

  const renderCard = (item: RecommendationItem) => {
    switch (item.type) {
      case "mostFollowed":
        return (
          <Card
            onClick={() => router.push(`/space/profile/${item.id}`)}
            className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="relative">
              {item.banner_url ? (
                <Image
                  src={item.banner_url || ""}
                  alt={`${item.user_name}'s profile cover`}
                  width={320}
                  height={120}
                  className="w-full h-32 object-cover"
                />
              ) : (
                <div className="h-32 bg-gradient-to-b from-transparent to-primary/80"></div>
              )}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/80"></div>
              <div className="absolute -bottom-4 left-2">
                <Avatar
                  onClick={() => router.push(`/space/profile/${item.id}`)}
                  className="h-24 w-24 border-[1.5px] duration-300 hover:border-primary cursor-pointer"
                >
                  <AvatarImage
                    src={item.avatar_url || "/placeholder-avatar.jpg"}
                    alt={item.full_name || "User Avatar"}
                    className="object-cover cursor-pointer"
                  />
                  <AvatarFallback>
                    {item.full_name ? item.full_name.charAt(0) : "U"}
                  </AvatarFallback>
                </Avatar>
              </div>
              <Badge className="absolute top-2 right-2 bg-primary flex items-center gap-1">
                <Users className="h-3 w-3" /> {item.tag}
              </Badge>
            </div>
            <CardContent className="pt-14 p-4">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-sm cursor-pointer">
                    {item.full_name || "Unknown User"}
                  </h4>
                  <Crown className="h-4 w-4 text-yellow-500" />
                </div>
                <span className="text-sm text-muted-foreground">
                  {item.user_name || "unknown"}
                </span>
                <p className="text-sm mt-2">{item.bio || "No bio available"}</p>
                <div className="flex items-center mt-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4 mr-1" />
                  <span>{item.followersCount || 0} followers</span>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case "highestRated":
        return (
          <Card
            onClick={() => {
              router.push(`/space/marketplace/${item.id}`);
            }}
            className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="relative">
              <Image
                src={item.image_url || "/placeholder-product.jpg"}
                alt={item.item_name || "Product Image"}
                width={320}
                height={200}
                className="w-full h-40 object-cover"
              />
              <Badge className="absolute top-2 right-2 bg-amber-500 hover:bg-amber-600 flex items-center gap-1">
                <Award className="h-3 w-3" /> {item.tag}
              </Badge>
            </div>
            <CardContent className="p-4">
              <h4 className="font-semibold text-sm mb-1">
                {item.item_name || "Unnamed Item"}
              </h4>
              <p className="text-sm text-muted-foreground mb-2">
                {item.item_description || "No description available"}
              </p>
              <div className="flex items-center justify-between">
                <span className="font-bold text-lg">
                  {item.item_price ? `$${item.item_price}` : "N/A"}
                </span>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm">
                    {item.average_rating?.toFixed(1) || "N/A"} (
                    {item.reviews_count || 0})
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case "availablePet":
        return (
          <Card
            onClick={() => {
              router.push(`/space/adoption`);
            }}
            className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="relative">
              <Image
                src={item.image_url || "/placeholder-pet.jpg"}
                alt={item.pet_name || "Pet Image"}
                width={320}
                height={200}
                className="w-full h-40 object-cover"
              />
              <Badge className="absolute top-2 right-2 bg-green-500 hover:bg-green-600 flex items-center gap-1">
                <Paw className="h-3 w-3" /> {item.tag}
              </Badge>
            </div>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-sm mb-1">
                  {item.pet_name || "Unnamed Pet"}
                </h4>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {item.pet_type || "Unknown Type"}
                  </Badge>
                  <Badge variant="outline">
                    {item.pet_age || "Unknown Age"} {item.pet_age_unit || ""}
                  </Badge>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                {item.pet_description || "No description available"}
              </p>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  // Only render the carousel if we have recommendations
  const hasRecommendations = recommendations.length > 0;

  return (
    <div className="space-y-1 w-full max-w-xs mx-auto">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold tracking-tight">Featured</h3>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-[400px] w-full">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : !hasRecommendations ? (
        <div className="flex items-center justify-center h-[400px] w-full border rounded-lg">
          <p className="text-muted-foreground">No recommendations available</p>
        </div>
      ) : (
        <div className="relative">
          <Carousel
            opts={{ align: "start", loop: true }}
            plugins={[Autoplay({ delay: 5000 })]}
            orientation="vertical"
            className="hidden md:block w-full max-w-xs"
          >
            {" "}
            <CarouselContent className="-mt-1 h-[400px]">
              {recommendations.map((item, index) => (
                <CarouselItem key={item.id || `item-${index}`} className="pt-1">
                  <div className="p-1">{renderCard(item)}</div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      )}
    </div>
  );
}

import { Database } from "@/database.types";

export type Profile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
};

export type Like = {
  id: string;
  user_id: string;
};

export type Comment = {
  id: string;
  content: string;
  created_at: string;
  profiles: Profile | null;
};

export type PostCardType = {
  id: string;
  content: string;
  image_url: string | null;
  created_at: string;
  profiles: Profile | null;
  likes: Like[];
  comments: Comment[];
  type: "NORMAL" | "HELP";
};

export type FeedType = "NORMAL" | "HELP" | "ADOPTION";

export type AdoptionPost = {
  created_at: string | null;
  id: string;
  image_url: string;
  pet_age: number;
  pet_age_unit: Database["public"]["Enums"]["pet_age-Unit"] | null;
  pet_description: string;
  pet_name: string;
  pet_type: string;
  user_id: string;
};

export type MarketplaceItem = {
  created_at: string | null;
  id: string;
  image_url: string;
  item_description: string;
  currency: Database["public"]["Enums"]["currency"] | null;
  item_name: string;
  item_price: number;
  item_type: string;
  user_id: string;
};

export type Notification = {
  id: string;
  recipient_id: string;
  sender_id: string;
  sender_name: string;
  type: "like" | "comment";
  post_id?: string;
  read: boolean;
  created_at: string;
};

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

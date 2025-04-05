import { Database } from "@/database.types";

export type Profile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
};

export type User = {
  avatar_url: string | null;
  created_at: string | null;
  full_name: string | null;
  id: string;
  role: Database["public"]["Enums"]["user_role"];
  user_name: string | null;
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

// Order types
export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface ShippingAddress {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phoneNumber?: string;
  [key: string]: string | undefined;
}

export interface Order {
  id: string;
  item_id: string;
  order_date: string;
  quantity: number;
  total_price: number;
  user_id: string;
}

export interface UserOrder {
  id: string;
  item_id: string;
  order_date: string;
  quantity: number;
  total_price: number;
  user_id: string;
  item: {
    id: string;
    item_name: string;
    item_price: number;
    image_url: string;
  } | null;
}

// Review types
export interface Review {
  content: string | null;
  created_at: string;
  id: string;
  item_id: string;
  order_id: string | null;
  rating: number;
  title: string | null;
  user_id: string;
  user: {
    id: string;
    full_name: string;
    avatar_url: string | null;
  } | null;
}

export interface ReviewFeedback {
  id: string;
  review_id: string;
  user_id: string;
  is_helpful: boolean;
  created_at: string;
}

// Input types for creating/updating
export interface CreateOrderInput {
  items: {
    item_id: string;
    quantity: number;
    price_per_unit: number;
  }[];
  shipping_address: ShippingAddress;
  payment_intent_id?: string;
}

export interface UpdateOrderInput {
  id: string;
  status?: OrderStatus;
  shipping_address?: ShippingAddress;
  payment_intent_id?: string;
}

export interface CreateReviewInput {
  item_id: string;
  order_id?: string;
  rating: number;
  title: string;
  content: string;
}

export interface UpdateReviewInput {
  id: string;
  rating?: number;
  title?: string;
  content?: string;
}

export interface ReviewFeedbackInput {
  review_id: string;
  is_helpful: boolean;
}

export interface PetShop {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  description: string;
  services: string[];
  phone?: string;
  website?: string;
}

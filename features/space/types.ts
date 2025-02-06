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

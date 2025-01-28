export type PostCard = {
  id: string;
  content: string;
  image_url: string | null;
  created_at: string;
  profiles: {
    full_name: string | null;
    avatar_url: string | null;
  };
  likes: {
    count: number;
  };
  comments: {
    id: string;
    content: string;
    created_at: string;
    profiles: {
      full_name: string | null;
      avatar_url: string | null;
    };
  }[];
};

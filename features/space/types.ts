export type Post = {
  id: string;
  content: string;
  image_url?: string;
  created_at: string;
  user: {
    name: string;
    avatar_url: string;
  };
  likes: number;
  comments: Comment[];
};

export type Comment = {
  id: string;
  content: string;
  created_at: string;
  user: {
    name: string;
    avatar_url: string;
  };
};

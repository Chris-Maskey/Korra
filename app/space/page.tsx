import { Separator } from "@/components/ui/separator";
import { CreatePost } from "@/features/space/components/create-post";
import { PostCard } from "@/features/space/components/post-card";

const samplePost = {
  user: {
    name: "John Doe",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  content: "Just finished an amazing project! 🚀 #coding #webdevelopment",
  // image: "/test.png",
  timestamp: new Date("2023-06-15T12:00:00"),
  likes: 42,
  comments: [
    {
      id: 1,
      user: "Jane Smith",
      content: "Congratulations! Can't wait to see it.",
      timestamp: new Date("2023-06-15T12:05:00"),
    },
    {
      id: 2,
      user: "Bob Johnson",
      content: "Great job! What technologies did you use?",
      timestamp: new Date("2023-06-15T12:10:00"),
    },
  ],
};

const MySpacePage = () => {
  return (
    <section className="space-y-6">
      <CreatePost />
      <Separator className="max-w-2xl mx-auto" />
      <PostCard {...samplePost} />
    </section>
  );
};

export default MySpacePage;

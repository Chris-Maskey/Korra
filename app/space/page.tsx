import { TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreatePost } from "@/features/space/components/create-post";
import { FeedPage } from "@/features/space/components/feed-page";
import { Tabs } from "@radix-ui/react-tabs";

const MySpacePage = () => {
  return (
    <section className="space-y-6">
      <CreatePost />
      <Tabs defaultValue="latest" className="space-y-3 ">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="latest">Latest</TabsTrigger>
          <TabsTrigger value="help">Help</TabsTrigger>
        </TabsList>
        <TabsContent value="latest">
          <FeedPage feedType="NORMAL" />
        </TabsContent>
        <TabsContent value="help">
          <FeedPage feedType="HELP" />
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default MySpacePage;

import { Database } from "@/database.types";
import { currentUser } from "@/features/auth/actions/current-user";
import { Navbar } from "@/features/space/components/navbar";
import { RecommendationCarousel } from "@/features/space/components/recommendation-carousel";
import { UserProfileCard } from "@/features/space/components/user-profile-card";

type SpaceLayoutProps = {
  children: React.ReactNode;
};

const SpaceLayout = async ({ children }: SpaceLayoutProps) => {
  const user: Database["public"]["Tables"]["profiles"]["Row"] =
    await currentUser();

  return (
    <main className="max-w-screen-xl mx-auto ">
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Navbar />
      </div>
      <section className="flex items-start gap-8 py-8">
        <div className="flex flex-col gap-4 w-full max-w-xs">
          <UserProfileCard state="expanded" profileId={user?.id} />
        </div>
        <section className="max-w-screen-md w-full">{children}</section>
        <RecommendationCarousel />
      </section>
    </main>
  );
};

export default SpaceLayout;

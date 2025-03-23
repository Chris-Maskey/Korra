import { Tables } from "@/database.types";
import { currentUser } from "@/features/auth/actions/current-user";
import { RecommendationCarousel } from "@/features/space/components/feed/recommendation-carousel";
import { UserProfileCard } from "@/features/space/components/shared/user-profile-card";
import React from "react";

type FeedLayoutProps = {
  children: React.ReactNode;
};

const FeedLayout = async ({ children }: FeedLayoutProps) => {
  const user: Tables<"profiles"> = await currentUser();

  if (!user) {
    return null;
  }

  return (
    <section className="flex items-start gap-8 py-8">
      <div className="flex-col gap-4 hidden lg:flex w-full max-w-xs">
        <UserProfileCard state="expanded" profileId={user?.id} />
      </div>
      <section className="max-w-screen-md w-full">{children}</section>
      <RecommendationCarousel />
    </section>
  );
};

export default FeedLayout;

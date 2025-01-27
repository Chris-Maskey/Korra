import { ModeToggle } from "@/components/ui/mode-toggle";
import { Database } from "@/database.types";
import { currentUser } from "@/features/auth/actions/current-user";
import { Navbar } from "@/features/space/components/navbar";
import { UserProfileCard } from "@/features/space/components/user-profile-card";
import { Pacifico } from "next/font/google";

type SpaceLayoutProps = {
  children: React.ReactNode;
};
const pacifico = Pacifico({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const SpaceLayout = async ({ children }: SpaceLayoutProps) => {
  const user: Database["public"]["Tables"]["profiles"]["Row"] =
    await currentUser();

  return (
    <main className="max-w-screen-xl mx-auto ">
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Navbar pacifico={pacifico} />
      </div>
      <section className="flex items-start gap-8 py-8">
        <UserProfileCard state="expanded" profileId={user?.id} />
        <section className="max-w-screen-md w-full">{children}</section>
        <ModeToggle />
      </section>
    </main>
  );
};

export default SpaceLayout;

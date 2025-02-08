import { Navbar } from "@/features/space/components/shared/navbar/navbar";

type SpaceLayoutProps = {
  children: React.ReactNode;
};

const SpaceLayout = async ({ children }: SpaceLayoutProps) => {
  return (
    <main className="max-w-screen-xl mx-auto ">
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Navbar />
      </div>
      {children}
    </main>
  );
};

export default SpaceLayout;

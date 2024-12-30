import { ModeToggle } from "@/components/ui/mode-toggle";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/features/space/components/app-sidebar";
import React from "react";

type SpaceLayoutProps = {
  children: React.ReactNode;
};

const SpaceLayout = ({ children }: SpaceLayoutProps) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        {children}
        <ModeToggle />
        <SidebarTrigger />
      </main>
    </SidebarProvider>
  );
};

export default SpaceLayout;

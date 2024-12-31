"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import { sidebarItems } from "../constants";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronUp,
  CircleUser,
  Loader2,
  LogOut,
  ReceiptIndianRupee,
  Settings,
  Sparkles,
} from "lucide-react";
import { SidebarHeaderComponent } from "./sidebar-header";

import { useSignOut } from "@/features/auth/hooks/use-sign-out";

export const AppSidebar = () => {
  const pathname = usePathname();

  const { state } = useSidebar();

  const { mutate, isPending } = useSignOut();

  const handleSignOut = () => {
    mutate();
  };

  return (
    <Sidebar side="left" collapsible="icon" variant="sidebar">
      <SidebarHeader className="flex flex-col gap-2 items-center justify-center py-6 px-4">
        <SidebarHeaderComponent state={state} />
      </SidebarHeader>
      <Separator />
      <SidebarContent className="px-4">
        <SidebarGroup />
        <SidebarGroupLabel>Explore</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu
            className={cn("", state === "collapsed" && "items-center")}
          >
            {sidebarItems.map((item) => (
              <SidebarMenuItem key={item.url}>
                <SidebarMenuButton
                  className={cn(
                    "py-6",
                    pathname === item.url &&
                      "bg-muted text-primary hover:text-primary",
                  )}
                  asChild
                >
                  <Link href={item.url}>
                    <item.icon className="size-4" />
                    <span>{item.title}</span>
                    {item.isPremium && (
                      <Sparkles className="text-yellow-500 ml-auto" />
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
        <SidebarGroup />
      </SidebarContent>
      <Separator />
      <SidebarFooter>
        <SidebarMenu
          className={cn("", state === "collapsed" && "items-center")}
        >
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <Settings /> Settings
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem className="cursor-pointer">
                  <CircleUser />
                  <span>Account</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <ReceiptIndianRupee />
                  <span>Billing</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="cursor-pointer"
                  disabled={isPending}
                >
                  <LogOut />
                  <span>Sign out</span>
                  {isPending && <Loader2 className="ml-auto" />}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

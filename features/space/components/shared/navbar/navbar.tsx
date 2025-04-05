"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Home,
  Search,
  Origami,
  PawPrint,
  ShoppingBag,
  MessageCircle,
  BookUser,
  Map,
} from "lucide-react";
import { UserMenu } from "../user-menu";
import NavbarButton from "./navbar-butons";
import NotificationTab from "./notification-tab";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";

export function Navbar() {
  const { data: user } = useCurrentUser();

  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4 container mx-auto">
        <Link href="/space/feed" className="mr-6 flex items-center space-x-2 ">
          <Origami className="text-primary/70 hover:text-primary duration-500" />
        </Link>
        <div className="flex items-center space-x-4 ml-auto">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>
          <NavbarButton title="Home" Icon={Home} redirectionUrl="/space/feed" />
          <NavbarButton
            title="Profiles"
            Icon={BookUser}
            redirectionUrl="/space/profile"
          />
          <NavbarButton
            title="Adopt"
            Icon={PawPrint}
            redirectionUrl="/space/adoption"
          />
          {user?.role === "PREMIUM" && (
            <NavbarButton
              title="Marketplace"
              Icon={ShoppingBag}
              redirectionUrl="/space/marketplace"
            />
          )}
          {user?.role === "PREMIUM" && (
            <NavbarButton title="Map" Icon={Map} redirectionUrl="/space/map" />
          )}
          <NavbarButton
            title="Chat"
            Icon={MessageCircle}
            redirectionUrl="/space/chat"
          />
          <NotificationTab />
          <UserMenu />
        </div>
      </div>
    </nav>
  );
}

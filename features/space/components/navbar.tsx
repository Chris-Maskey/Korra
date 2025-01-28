"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, Home, MessageCircle, Search, Origami } from "lucide-react";
import { UserMenu } from "./user-menu";
import { NextFont } from "next/dist/compiled/@next/font";
import { usePathname } from "next/navigation";

type NavbarProps = {
  pacifico: NextFont;
};

export function Navbar({ pacifico }: NavbarProps) {
  const pathname = usePathname();

  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4 container mx-auto">
        <Link href="/space" className="mr-6 flex items-center space-x-2 ">
          <Origami className="text-primary" />
          <span className={`text-2xl font-bold ${pacifico.className}`}>
            Korra
          </span>
        </Link>
        <div className="hidden md:flex flex-1 justify-center">
          <form className="w-full max-w-sm">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="pl-8 w-full"
              />
            </div>
          </form>
        </div>
        <div className="flex items-center space-x-4 ml-auto">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>
          <Button
            variant={pathname === "/space" ? "default" : "ghost"}
            size="icon"
          >
            <Home className="h-5 w-5" />
            <span className="sr-only">Home</span>
          </Button>
          <Button variant="ghost" size="icon">
            <MessageCircle className="h-5 w-5" />
            <span className="sr-only">Messages</span>
          </Button>
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>
          <UserMenu />
        </div>
      </div>
    </nav>
  );
}

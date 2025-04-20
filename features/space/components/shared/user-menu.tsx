"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import { useSignOut } from "@/features/auth/hooks/use-sign-out";
import { Moon, Sun, User, CreditCard, LogOut, Crown } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";

export function UserMenu() {
  const { setTheme, theme } = useTheme();
  const { data: user } = useCurrentUser();
  const router = useRouter();

  const { mutate: signOut } = useSignOut();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={user?.avatar_url || ""}
              alt={user?.user_name || "User avatar"}
              className="rounded-full object-cover"
            />
            <AvatarFallback>
              {user?.full_name ? user.full_name[0] : ""}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel
          onClick={() => router.push(`/space/profile/${user?.id}`)}
          className="font-normal cursor-pointer"
        >
          <div className="flex flex-col space-y-1">
            <p className="flex items-center gap-2 text-sm font-medium leading-none">
              {user?.full_name}
              {user?.role === "PREMIUM" && (
                <Crown className="h-3 w-3 text-yellow-500" />
              )}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              @{user?.user_name}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => router.push("/space/profile/settings")}
          className="cursor-pointer"
        >
          <User className="mr-2 h-4 w-4" />
          <span>Manage Account</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          <CreditCard className="mr-2 h-4 w-4" />
          <span>Billing</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="cursor-pointer"
        >
          {theme === "light" ? (
            <Moon className="mr-2 h-4 w-4" />
          ) : (
            <Sun className="mr-2 h-4 w-4" />
          )}
          <span>Switch Theme</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type NavbarButtonProps = {
  title: string;
  Icon: LucideIcon;
  redirectionUrl: string;
};

const NavbarButton = ({ title, Icon, redirectionUrl }: NavbarButtonProps) => {
  const pathname = usePathname();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link href={redirectionUrl}>
            <Button
              variant={pathname === redirectionUrl ? "default" : "ghost"}
              size={"icon"}
            >
              <Icon className="h-5 w-5" />
              <span className="sr-only">{title}</span>
            </Button>
          </Link>
        </TooltipTrigger>
        <TooltipContent>{title}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default NavbarButton;

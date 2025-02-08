"use client";

import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

type NavbarButtonProps = {
  title: string;
  Icon: LucideIcon;
  redirectionUrl: string;
};

const NavbarButton = ({ title, Icon, redirectionUrl }: NavbarButtonProps) => {
  const pathname = usePathname();

  return (
    <Link href={redirectionUrl}>
      <Button
        variant={pathname === redirectionUrl ? "default" : "ghost"}
        size={"icon"}
      >
        <Icon className="h-5 w-5" />
        <span className="sr-only">{title}</span>
      </Button>
    </Link>
  );
};

export default NavbarButton;

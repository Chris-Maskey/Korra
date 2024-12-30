import { HandCoins, Home, PawPrint, Store } from "lucide-react";

export const sidebarItems = [
  {
    title: "Home",
    url: "/space",
    icon: Home,
    isPremium: false,
  },
  {
    title: "Marketplace",
    url: "/space/marketplace",
    icon: Store,
    isPremium: true,
  },
  {
    title: "Donations",
    url: "/space/donations",
    icon: HandCoins,
    isPremium: false,
  },
  {
    title: "Lost Pets",
    url: "/space/lost-pets",
    icon: PawPrint,
    isPremium: false,
  },
];

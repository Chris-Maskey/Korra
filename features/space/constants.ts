import { HandCoins, Home, PawPrint, Store } from "lucide-react";
import { ServiceOption } from "./types";

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

/**
 * Available pet shop services
 */
export const SERVICES: ServiceOption[] = [
  { label: "Pet Supplies", value: "supplies" },
  { label: "Grooming", value: "grooming" },
  { label: "Veterinary", value: "veterinary" },
  { label: "Adoption", value: "adoption" },
  { label: "Training", value: "training" },
  { label: "Boarding", value: "boarding" },
  { label: "Daycare", value: "daycare" },
];

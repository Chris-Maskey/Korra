"use client";

import { useGetPremium } from "../hooks/use-get-premium";
import { Button } from "@/components/ui/button";

export const GetPremiumButton = () => {
  const { mutateAsync: getPremium, isPending } = useGetPremium();

  const handleGetPremium = async () => {
    await getPremium();
  };

  return (
    <Button className="w-full" onClick={handleGetPremium} disabled={isPending}>
      Get Started
    </Button>
  );
};

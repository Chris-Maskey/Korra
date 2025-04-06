"use client";

import { useGetPremium } from "../hooks/use-get-premium";
import { Button } from "@/components/ui/button";

export const GetPremiumButton = ({
  plan,
}: {
  plan: "PREMIUM" | "ORGANIZATION";
}) => {
  const { mutateAsync: getPremium, isPending } = useGetPremium();

  const handleGetPremium = async () => {
    await getPremium(plan);
  };

  return (
    <Button className="w-full" onClick={handleGetPremium} disabled={isPending}>
      Get Started
    </Button>
  );
};

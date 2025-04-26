"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useDonationModal } from "@/context/donation-modal-context";
import { createCheckoutSession } from "@/features/space/actions/donation/donation";
import { useMutation } from "@tanstack/react-query";
import { HeartHandshake, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const DONATION_AMOUNTS = [5, 10, 25, 50, 100];

export const DonationModal = () => {
  const { isOpen, closeModal, postId, postOwnerId } = useDonationModal();
  const [customAmount, setCustomAmount] = useState<string>("");
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: async (amount: number) => {
      const session = await createCheckoutSession({
        amount,
        postId,
        postOwnerId,
      });

      if (session.url) {
        router.push(session.url);
      }
    },
  });

  const handleDonation = (amount: number) => {
    mutate(amount);
  };

  const handleCustomDonation = () => {
    const amount = Number.parseFloat(customAmount);
    if (!isNaN(amount) && amount > 0) {
      mutate(amount);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers and decimal point
    const value = e.target.value;
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setCustomAmount(value);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden rounded-lg">
        <div className="bg-primary/10 p-6 flex items-center justify-center border-b">
          <HeartHandshake className="h-10 w-10 text-primary mr-3" />
          <DialogTitle className="text-xl font-semibold">
            Support this post
          </DialogTitle>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-3 gap-2">
            {DONATION_AMOUNTS.map((amount) => (
              <Button
                key={amount}
                variant={isPending ? "outline" : "secondary"}
                onClick={() => handleDonation(amount)}
                disabled={isPending}
                className="h-12 font-medium text-sm hover:scale-105 transition-transform"
              >
                ${amount}
              </Button>
            ))}
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                $
              </span>
              <input
                type="text"
                inputMode="decimal"
                value={customAmount}
                onChange={handleInputChange}
                placeholder="Donation Amount"
                className="w-full h-12 pl-8 pr-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary placeholder:text-xs"
                disabled={isPending}
              />
            </div>
            <Button
              onClick={handleCustomDonation}
              disabled={
                isPending ||
                !customAmount ||
                Number.parseFloat(customAmount) <= 0
              }
              className="h-12 px-4"
            >
              Donate
            </Button>
          </div>

          {isPending && (
            <div className="flex justify-center items-center py-2 bg-primary/5 rounded-md">
              <Loader2 className="h-5 w-5 animate-spin text-primary mr-2" />
              <span className="text-sm font-medium">
                Processing your donation...
              </span>
            </div>
          )}
        </div>

        <div className="bg-muted/30 px-6 py-4 text-xs text-center text-muted-foreground">
          Secure payment processing by Stripe. Your donation directly supports
          the creator.
        </div>
      </DialogContent>
    </Dialog>
  );
};

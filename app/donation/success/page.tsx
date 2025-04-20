"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowLeft, Share2 } from "lucide-react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";

export default function DonationSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const updateDonationStatus = async () => {
      if (sessionId) {
        const supabase = createClient();

        setLoading(true);
        await supabase
          .from("donations")
          .update({ status: "completed" })
          .eq("stripe_session_id", sessionId);
      }
      setLoading(false);
    };

    updateDonationStatus();
  }, [sessionId]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary/5 to-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-card rounded-xl shadow-lg overflow-hidden"
      >
        <div className="bg-primary/10 p-6 flex flex-col items-center justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <div className="rounded-full bg-primary/10 p-3 mb-2">
              <CheckCircle className="w-10 h-10 text-primary" />
            </div>
          </motion.div>
          <h1 className="text-xl font-bold text-center">Thank You!</h1>
          <p className="text-sm text-muted-foreground text-center mt-1">
            Your donation has been received
          </p>
        </div>

        <div className="p-6">
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-sm text-muted-foreground">Status</span>
              <span className="text-sm font-medium flex items-center">
                <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                Completed
              </span>
            </div>

            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-muted-foreground">
                Transaction ID
              </span>
              <span className="text-xs font-mono bg-muted px-2 py-1 rounded">
                {sessionId?.substring(0, 8)}...
              </span>
            </div>

            <div className="mt-2 flex gap-3">
              <Button
                onClick={() => router.push("/")}
                variant="outline"
                size="sm"
                disabled={loading}
                className="flex-1"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Return Home
              </Button>

              <Button
                variant="secondary"
                size="sm"
                className="flex-1"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: "I just made a donation!",
                      text: "I just supported a great cause. Check it out!",
                      url: window.location.origin,
                    });
                  }
                }}
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-muted/30 px-6 py-4 text-xs text-center text-muted-foreground">
          A receipt has been sent to your email address
        </div>
      </motion.div>
    </div>
  );
}

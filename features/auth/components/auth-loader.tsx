"use client";

import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

interface AuthLoaderProps {
  message?: string;
  className?: string;
}

export function AuthLoader({
  message = "Authenticating...",
  className,
}: AuthLoaderProps) {
  const [showDelayedMessage, setShowDelayedMessage] = useState(false);

  // Show a different message if loading takes more than 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowDelayedMessage(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm transition-all duration-300",
        className,
      )}
    >
      <div className="flex flex-col items-center justify-center space-y-8 text-center">
        <div className="relative">
          {/* Outer glow effect */}
          <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl"></div>

          {/* Spinner */}
          <Spinner size="lg" className="relative text-primary" />
        </div>

        {/* Primary message */}
        <div className="space-y-2">
          <h3 className="text-xl font-medium text-foreground animate-pulse">
            {message}
          </h3>

          {/* Secondary message that appears after delay */}
          {showDelayedMessage && (
            <p className="text-sm text-muted-foreground animate-fade-in">
              This is taking longer than usual. Please wait a moment...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// Add this to your globals.css or create a new animation
// @keyframes fadeIn {
//   from { opacity: 0; }
//   to { opacity: 1; }
// }
// .animate-fade-in {
//   animation: fadeIn 0.5s ease-in-out forwards;
// }

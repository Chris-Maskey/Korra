"use client";

import { useState } from "react";
import { SignInCard } from "./sign-in-card";
import { SignUpCard } from "./sign-up-card";
import { SignInFlow } from "../types";
import { BackgroundBeams } from "@/components/ui/background-beams";

export const AuthScreen = () => {
  const [state, setState] = useState<SignInFlow>("signin");

  return (
    <div className="flex h-full items-center justify-center">
      <div className="md:h-auto max-w-lg z-10">
        {state === "signin" ? (
          <SignInCard setAuthStateAction={setState} />
        ) : (
          <SignUpCard setAuthStateAction={setState} />
        )}
        {/* <ModeToggle /> */}
      </div>
      <BackgroundBeams />
    </div>
  );
};

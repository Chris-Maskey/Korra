"use client";

import { SignInCard } from "./sign-in-card";

export const AuthScreen = () => {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="md:h-auto  max-w-lg">
        <SignInCard />
      </div>
    </div>
  );
};

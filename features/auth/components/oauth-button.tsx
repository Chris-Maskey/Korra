"use client";

import { Button } from "@/components/ui/button";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { signInWithOAuth } from "../actions/sign-in-with-oauth";

type OAuthButtonProps = {
  disabled?: boolean;
};

const OAuthButton = ({ disabled }: OAuthButtonProps) => {
  const handleSignIn = async (provider: "google" | "github") => {
    try {
      await signInWithOAuth(provider);
    } catch (error) {
      console.error("OAuth Sign-In Error:", error);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size={"lg"}
        className="w-full"
        disabled={disabled}
        onClick={async () => await handleSignIn("google")}
      >
        <FcGoogle className="size-5" />
        Continue with Google
      </Button>
      <Button
        variant="outline"
        size={"lg"}
        className="w-full"
        disabled={disabled}
        onClick={async () => await handleSignIn("github")}
      >
        <FaGithub className="size-5" />
        Continue with GitHub
      </Button>
    </>
  );
};

export default OAuthButton;

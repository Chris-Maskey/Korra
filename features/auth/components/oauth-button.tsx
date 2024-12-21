"use client";

import { Button } from "@/components/ui/button";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

import { useOAuth } from "../api/use-oauth.ts";

type OAuthButtonProps = {
  disabled?: boolean;
};

const OAuthButton = ({ disabled }: OAuthButtonProps) => {
  const { signInWithProvider } = useOAuth();

  return (
    <>
      <Button
        variant="outline"
        size={"lg"}
        className="w-full"
        disabled={disabled}
        onClick={() => signInWithProvider("google")}
      >
        <FcGoogle className="size-5" />
        Continue with Google
      </Button>
      <Button
        variant="outline"
        size={"lg"}
        className="w-full"
        disabled={disabled}
        onClick={() => signInWithProvider("github")}
      >
        <FaGithub className="size-5" />
        Continue with GitHub
      </Button>
    </>
  );
};

export default OAuthButton;

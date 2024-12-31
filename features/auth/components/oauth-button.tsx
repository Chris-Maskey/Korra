"use client";

import { Button } from "@/components/ui/button";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Provider } from "@supabase/supabase-js";
import { useSignInWithOAuth } from "../hooks/use-sign-in-with-oauth";

type OAuthButtonProps = {
  disabled?: boolean;
};

const OAuthButton = ({ disabled }: OAuthButtonProps) => {
  const { mutate, isPending } = useSignInWithOAuth();

  const handleSignIn = (provider: Provider) => {
    mutate(provider);
  };

  return (
    <>
      <Button
        variant="outline"
        size={"lg"}
        className="w-full"
        disabled={disabled || isPending}
        onClick={() => handleSignIn("google")}
      >
        <FcGoogle className="size-5" />
        Continue with Google
      </Button>
      <Button
        variant="outline"
        size={"lg"}
        className="w-full"
        disabled={disabled || isPending}
        onClick={() => handleSignIn("github")}
      >
        <FaGithub className="size-5" />
        Continue with GitHub
      </Button>
    </>
  );
};

export default OAuthButton;

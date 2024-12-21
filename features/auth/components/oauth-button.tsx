"use client";

import { Button } from "@/components/ui/button";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

type OAuthButtonProps = {
  disabled?: boolean;
};

const OAuthButton = ({ disabled }: OAuthButtonProps) => {
  return (
    <>
      <Button
        variant="outline"
        size={"lg"}
        className="w-full"
        disabled={disabled}
      >
        <FcGoogle className="size-5" />
        Continue with Google
      </Button>
      <Button
        variant="outline"
        size={"lg"}
        className="w-full"
        disabled={disabled}
      >
        <FaGithub className="size-5" />
        Continue with GitHub
      </Button>
    </>
  );
};

export default OAuthButton;

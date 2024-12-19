"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

export const SignInCard = () => {
  return (
    <Card className="w-full ">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Get Started Now</CardTitle>
        <CardDescription>
          Use your email or another service to continue
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Button variant="outline" size={"lg"} className="w-full">
            <FcGoogle className="size-5" />
            Continue with Google
          </Button>
          <Button variant="outline" size={"lg"} className="w-full">
            <FaGithub className="size-5" />
            Continue with GitHub
          </Button>
        </div>
        <div className="flex items-center gap-2 max-w-lg">
          <div className="h-px flex-1 bg-muted"></div>
          <span className="text-muted-foreground text-sm">or</span>
          <div className="h-px flex-1 bg-muted"></div>
        </div>
      </CardContent>
    </Card>
  );
};

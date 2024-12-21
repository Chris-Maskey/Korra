"use client";

import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SignInFlow } from "../types";
import { signInSchema } from "../schema";
import { useSignIn } from "../api/use-sign-in";
import { Loader2 } from "lucide-react";

type SignInSchemaType = z.infer<typeof signInSchema>;

type SignInCardProps = {
  setAuthStateAction: (state: SignInFlow) => void;
};

export const SignInCard = ({ setAuthStateAction }: SignInCardProps) => {
  const { mutate, isPending } = useSignIn();

  const form = useForm<SignInSchemaType>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const year = new Date().getFullYear();

  const onSubmit = (values: SignInSchemaType) => {
    mutate({ json: values });
  };

  return (
    <Card className="w-full  mx-auto px-8 pt-4">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold ">Welcome back</CardTitle>
        <CardDescription className="">
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/*
         * NOTE: Social Authentication
         */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Button
            variant="outline"
            size={"lg"}
            className="w-full"
            disabled={isPending}
          >
            <FcGoogle className="size-5" />
            Continue with Google
          </Button>
          <Button
            variant="outline"
            size={"lg"}
            className="w-full"
            disabled={isPending}
          >
            <FaGithub className="size-5" />
            Continue with GitHub
          </Button>
        </div>
        <div className="flex items-center gap-2 max-w-lg">
          <div className="h-px flex-1 bg-muted"></div>
          <span className="text-muted-foreground text-sm">or</span>
          <div className="h-px flex-1 bg-muted"></div>
        </div>

        {/*
         * NOTE: Email and Password based authentication
         */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" size={"lg"} disabled={isPending}>
              {isPending ? (
                <Loader2 className="animate-spin size-4" />
              ) : (
                <span> Sign In</span>
              )}
            </Button>
          </form>
        </Form>
        <p className="text-xs text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Button
            variant="link"
            className="p-0 h-auto text-xs text-primary"
            onClick={() => setAuthStateAction("signup")}
          >
            Sign Up
          </Button>
        </p>
      </CardContent>
      <CardFooter className="flex flex-col items-center justify-center space-y-2">
        <p className="text-xs text-muted-foreground">
          &copy; {year} Korra. All rights reserved.
        </p>
      </CardFooter>
    </Card>
  );
};

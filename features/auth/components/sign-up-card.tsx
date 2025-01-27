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
import OAuthButton from "./oauth-button";
import { signUpSchema } from "../schema";
import { Loader2 } from "lucide-react";
import { useSignUp } from "../hooks/use-sign-up";

type SignUpSchemaType = z.infer<typeof signUpSchema>;

type SignUpCardProps = {
  setAuthStateAction: (state: SignInFlow) => void;
};

export const SignUpCard = ({ setAuthStateAction }: SignUpCardProps) => {
  const { mutate, isPending } = useSignUp();

  const form = useForm<SignUpSchemaType>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const year = new Date().getFullYear();

  const onSubmit = async (values: SignUpSchemaType) => {
    mutate(values, {
      onSuccess: () => {
        form.reset();
        setAuthStateAction("signin");
      },
    });
  };

  return (
    <Card className="w-full mx-auto px-8 pt-4">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold ">Create an account</CardTitle>
        <CardDescription className="">
          Enter your email below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/*NOTE: Social Authentication*/}
        <div className="grid gap-4 sm:grid-cols-2">
          <OAuthButton disabled={isPending} />
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
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isPending} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isPending} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" size={"lg"} disabled={isPending}>
              {isPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                <span>Sign Up</span>
              )}
            </Button>
          </form>
        </Form>
        <p className="text-xs text-muted-foreground">
          Already have an account?{" "}
          <Button
            variant="link"
            className="p-0 h-auto text-primary text-xs"
            onClick={() => setAuthStateAction("signin")}
            disabled={isPending}
          >
            Sign In
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

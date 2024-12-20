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

const signUpSchema = z.object({
  username: z.string().min(1, {
    message: "Username is required",
  }),
  email: z.string().email().min(1, {
    message: "Email is required",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
});

type SignUpSchemaType = z.infer<typeof signUpSchema>;

type SignUpCardProps = {
  setState: (state: SignInFlow) => void;
};
export const SignUpCard = ({ setState }: SignUpCardProps) => {
  const form = useForm<SignUpSchemaType>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const year = new Date().getFullYear();

  return (
    <Card className="w-full mx-auto px-8 pt-4">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold ">Create an account</CardTitle>
        <CardDescription className="">
          Enter your email below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/*
         * NOTE: Social Authentication
         */}
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

        {/*
         * NOTE: Email and Password based authentication
         */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) => console.log(data))}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                    <Input {...field} type="email" />
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
                    <Input {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" size={"lg"}>
              Sign Up
            </Button>
          </form>
        </Form>
        <p className="text-xs text-muted-foreground">
          Already have an account?{" "}
          <Button
            variant="link"
            className="p-0 h-auto text-primary text-xs"
            onClick={() => setState("signin")}
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

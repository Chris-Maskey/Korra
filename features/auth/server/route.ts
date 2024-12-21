import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { signInSchema, signUpSchema } from "../schema";
import { createClient } from "@/lib/supabase/server";

const app = new Hono()
  .post("/sign-in", zValidator("json", signInSchema), async (c) => {
    const supabase = await createClient();
    const { email, password } = c.req.valid("json");

    const user = await supabase.auth.getUser();
    if (user.data.user) {
      return c.json(
        { message: "You are already signed in", data: user.data.user },
        200,
      );
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return c.json({ message: error.message }, 400);
    }
    return c.json({ message: "Sign-In Successful", data }, 200);
  })
  .post("/sign-up", zValidator("json", signUpSchema), async (c) => {
    const supabase = await createClient();
    const { firstName, lastName, email, password } = c.req.valid("json");

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          fullName: `${firstName} ${lastName}`,
        },
      },
    });

    if (error) {
      return c.json({ message: error.message }, 400);
    }
    return c.json({ message: "Sign-Up Successful", data }, 200);
  });

export default app;

"use server";

import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

export const getPremium = async () => {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (!user || authError) {
    throw new Error("Unauthorized");
  }

  if (!process.env.NEXT_PUBLIC_APP_URL) {
    throw new Error("Missing NEXT_PUBLIC_APP_URL environment variable");
  }

  const { url } = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: "price_1R29nzRrM1sO2KcO1WNFGpYe",
        quantity: 1,
      },
    ],
    metadata: {
      userId: user.id,
    },
    mode: "subscription",
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/space/feed`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/space/feed`,
  });

  if (user.id) {
    const userId = user.id;
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ role: "PREMIUM" })
        .eq("id", userId);

      if (error) {
        console.error("Database update error:", error);
      }
    } catch (error) {
      console.error("Unexpected error during database update:", error);
    }
  }

  return url;
};

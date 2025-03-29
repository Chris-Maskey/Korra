"use server";

import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const buyItem = async (productId: string, quantity: number) => {
  const supabase = await createClient();

  const { data: marketplaceItem, error } = await supabase
    .from("marketplace")
    .select("*")
    .eq("id", productId)
    .single();

  if (error) {
    throw new Error("Failed to fetch marketplace item: " + error.message);
  }

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: marketplaceItem.currency,
          unit_amount: marketplaceItem.item_price * 100,
          product_data: {
            name: marketplaceItem.item_name,
            description: marketplaceItem.item_description,
            images: [marketplaceItem.image_url],
          },
        },
        quantity: quantity,
      },
    ],
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/space/marketplace`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/space/marketplace`,
  });

  return redirect(session.url!);
};

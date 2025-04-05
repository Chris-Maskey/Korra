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

  // Calculate total price for passing to success page
  const totalPrice = marketplaceItem.item_price * quantity;

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
    // Update success and cancel URLs to point to our new pages
    success_url:
      `${process.env.NEXT_PUBLIC_APP_URL}/space/marketplace/success?` +
      `orderId={CHECKOUT_SESSION_ID}` +
      `&productId=${productId}` +
      `&productName=${encodeURIComponent(marketplaceItem.item_name)}` +
      `&quantity=${quantity}` +
      `&totalPrice=${totalPrice}`,
    cancel_url:
      `${process.env.NEXT_PUBLIC_APP_URL}/space/marketplace/cancel?` +
      `error=${encodeURIComponent("Payment was cancelled")}` +
      `&productId=${productId}`,
  });

  return redirect(session.url!);
};

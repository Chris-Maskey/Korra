import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const config = {
  runtime: "nodejs",
};

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const body = await request.text();
  const headerList = await headers();
  const signature = headerList.get("Stripe-Signature") as string;

  const signingSecret = process.env.STRIPE_SIGNING_SECRET!;
  if (!signingSecret) {
    console.error("Stripe signing secret is missing.");
    return new NextResponse("Server configuration error", { status: 500 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, signingSecret);
  } catch (error) {
    console.error("Webhook error:", error);
    return new NextResponse("Webhook error", { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object;
      const productId = session.metadata?.productId;
      const quantity = parseInt(session.metadata?.quantity || "0", 10);

      //TODO: Decrement the quantity of the product
      if (productId && quantity > 0) {
        const { error } = await supabase.rpc("decrement_quantity", {
          product_id: productId,
          decrement_value: quantity,
        });

        if (error) {
          console.error(
            "Failed to update marketplace quantity:",
            error.message
          );
          return new NextResponse("Database update error", { status: 500 });
        }
      }

      console.log("checkout.session.completed");
      break;
    case "payment_intent.succeeded":
      console.log("payment_intent.succeeded");
      break;
    case "payment_intent.payment_failed":
      console.log("payment_intent.payment_failed");
      break;
    default:
      console.log("Unknown event type:", event.type);
  }

  return new NextResponse(null, { status: 200 });
}

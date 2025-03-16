import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

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

  if (
    event.type === "checkout.session.completed" &&
    event.data.object.payment_status === "paid"
  ) {
    const metadata = event.data.object.metadata;
    if (metadata) {
      const userId = metadata.userId;
      try {
        const { data, error } = await supabase
          .from("profiles")
          .update({ role: "PREMIUM" })
          .eq("id", userId);

        if (error) {
          console.error("Database update error:", error);
          return new NextResponse("Database error", { status: 500 });
        }
        console.log("Database updated:", data);
      } catch (error) {
        console.error("Unexpected error during database update:", error);
        return new NextResponse("Unexpected server error", { status: 500 });
      }
    }
  }

  revalidatePath("/", "layout");

  return new NextResponse(null, { status: 200 });
}

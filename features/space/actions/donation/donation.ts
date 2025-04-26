"use server";

import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

interface CreateCheckoutSessionParams {
  amount: number;
  postId: string;
  postOwnerId: string;
}

export async function createCheckoutSession({
  amount,
  postId,
  postOwnerId,
}: CreateCheckoutSessionParams) {
  try {
    const supabase = await createClient();

    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("User not authenticated");
    }

    // Get the profile of the post owner
    const { data: ownerProfile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", postOwnerId)
      .single();

    if (!ownerProfile) {
      throw new Error("Post owner not found");
    }

    // Create a donation record in the database
    const { data: donation, error } = await supabase
      .from("donations")
      .insert({
        amount: amount * 100, // Store in cents
        post_id: postId,
        donor_id: user.id,
        recipient_id: postOwnerId,
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    // Create a Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Donation to ${ownerProfile.full_name || "User"}`,
              description: `Supporting post #${postId}`,
            },
            unit_amount: amount * 100, // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/donation/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/space/donation/cancel`,
      metadata: {
        donation_id: donation.id,
        post_id: postId,
        donor_id: user.id,
        recipient_id: postOwnerId,
      },
    });

    // Update the donation with the session ID
    await supabase
      .from("donations")
      .update({ stripe_session_id: session.id })
      .eq("id", donation.id);

    revalidatePath("/");

    return { url: session.url };
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return { error: "Failed to create checkout session" };
  }
}

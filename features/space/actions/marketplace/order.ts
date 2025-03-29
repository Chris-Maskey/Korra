"use server";

import { revalidatePath } from "next/cache";
import type {
  CreateOrderInput,
  Order,
  OrderItem,
  UpdateOrderInput,
} from "@/features/space/types";
import { createClient } from "@/lib/supabase/server";

// Create a new order
export async function createOrder(
  input: CreateOrderInput,
): Promise<{ success: boolean; data?: Order; error?: string }> {
  try {
    const supabase = await createClient();

    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    // Calculate total amount
    const totalAmount = input.items.reduce(
      (sum, item) => sum + item.price_per_unit * item.quantity,
      0,
    );

    // Start a transaction
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        status: "pending",
        total_amount: totalAmount,
        shipping_address: input.shipping_address,
        payment_intent_id: input.payment_intent_id,
      })
      .select()
      .single();

    if (orderError) {
      throw new Error(orderError.message);
    }

    // Insert order items
    const orderItems = input.items.map((item) => ({
      order_id: order.id,
      item_id: item.item_id,
      quantity: item.quantity,
      price_per_unit: item.price_per_unit,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      throw new Error(itemsError.message);
    }

    revalidatePath("/orders");
    revalidatePath("/marketplace");

    return { success: true, data: order as Order };
  } catch (error) {
    console.error("Error creating order:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create order",
    };
  }
}

// Get orders for the current user
export async function getUserOrders(): Promise<{
  success: boolean;
  data?: Order[];
  error?: string;
}> {
  try {
    const supabase = await createClient();

    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    // Get orders
    const { data: orders, error: ordersError } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (ordersError) {
      throw new Error(ordersError.message);
    }

    return { success: true, data: orders as Order[] };
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch orders",
    };
  }
}

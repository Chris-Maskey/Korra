"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { Order, UserOrder } from "../../types";

// Create a new order
export async function createOrder(
  itemId: string,
  quantity: number,
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

    // Get the item details to calculate total price and check stock
    const { data: item, error: itemError } = await supabase
      .from("marketplace")
      .select("id, item_price, item_quantity")
      .eq("id", itemId)
      .single();

    if (itemError) {
      throw new Error(itemError.message);
    }

    // Check if there's enough stock
    if (item.item_quantity < quantity) {
      return {
        success: false,
        error: `Not enough stock. Only ${item.item_quantity} items available.`,
      };
    }

    // Calculate total price
    const totalPrice = Number.parseFloat(item.item_price.toString()) * quantity;

    // Create the order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        item_id: itemId,
        quantity: quantity,
        total_price: totalPrice,
      })
      .select()
      .single();

    if (orderError) {
      throw new Error(orderError.message);
    }

    revalidatePath(`/space/marketplace/${itemId}`);

    return { success: true, data: order };
  } catch (error) {
    console.error("Error creating order:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create order",
    };
  }
}

// Get user orders
export async function getUserOrders(): Promise<{
  success: boolean;
  data?: UserOrder[];
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

    // Get user orders with item details
    const { data: orders, error: ordersError } = await supabase
      .from("orders")
      .select(
        `
        *,
        item:marketplace(
          id,
          item_name,
          item_price,
          image_url
        )
      `,
      )
      .eq("user_id", user.id)
      .order("order_date", { ascending: false });

    if (ordersError) {
      throw new Error(ordersError.message);
    }

    return { success: true, data: orders };
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch orders",
    };
  }
}

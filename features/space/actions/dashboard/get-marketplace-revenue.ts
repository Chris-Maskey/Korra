"use server";

import { createClient } from "@/lib/supabase/server";
import { DashboardRevenueData } from "../../types";

const getMonthRange = (date: Date): { gte: string; lt: string } => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const gte = new Date(year, month, 1).toISOString();
  const lt = new Date(year, month + 1, 1).toISOString();
  return { gte, lt };
};

const fetchRevenue = async (
  userId: string,
  startDate: string,
  endDate: string,
): Promise<number> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select("total_price")
    .eq("vendor_id", userId)
    .gte("order_date", startDate)
    .lt("order_date", endDate);

  if (error) {
    console.error("Error fetching revenue:", error);
    throw error;
  }

  const totalRevenue = data.reduce(
    (acc, order) => acc + (order.total_price || 0),
    0,
  );

  return totalRevenue;
};

export const getDashboardMarketplaceRevenue =
  async (): Promise<DashboardRevenueData> => {
    const supabase = await createClient();

    const { data: user, error: authError } = await supabase.auth.getUser();

    if (!user || authError) {
      throw new Error(authError?.message || "Authentication required");
    }

    const userId = user.user.id;

    // Calculate dates for current and previous months
    const currentDate = new Date();
    const previousMonthDate = new Date();
    previousMonthDate.setMonth(currentDate.getMonth() - 1);

    // Fetch revenue for current and previous months
    const currentMonthRange = getMonthRange(currentDate);
    const previousMonthRange = getMonthRange(previousMonthDate);

    const currentMonthRevenue = await fetchRevenue(
      userId,
      currentMonthRange.gte,
      currentMonthRange.lt,
    );
    const previousMonthRevenue = await fetchRevenue(
      userId,
      previousMonthRange.gte,
      previousMonthRange.lt,
    );

    // Calculate revenue growth
    const revenueGrowth =
      previousMonthRevenue === 0
        ? 100
        : ((currentMonthRevenue - previousMonthRevenue) /
            previousMonthRevenue) *
          100;

    const growthRate: "up" | "down" = revenueGrowth > 0 ? "up" : "down";

    return {
      previousMonthRevenue,
      currentMonthRevenue,
      revenueGrowth,
      growthRate,
    };
  };

export const getTotalMarketplaceRevenue = async () => {
  const supabase = await createClient();

  const { data: user, error: authError } = await supabase.auth.getUser();

  if (!user || authError) {
    throw new Error(authError?.message || "Authentication required");
  }

  const { data, error } = await supabase
    .from("orders")
    .select(`total_price, order_date`)
    .eq("vendor_id", user.user.id)
    .order("order_date", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

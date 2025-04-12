"use server";

import { createClient } from "@/lib/supabase/server";
import { DashboardAdoptionData } from "../../types";

const getMonthRange = (date: Date): { gte: string; lt: string } => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const gte = new Date(year, month, 1).toISOString();
  const lt = new Date(year, month + 1, 1).toISOString();
  return { gte, lt };
};

const fetchAdoption = async (
  userId: string,
  startDate: string,
  endDate: string,
) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("adoption")
    .select("id", { count: "exact" })
    .eq("adoption_status", "ADOPTED")
    .eq("user_id", userId)
    .gte("created_at", startDate)
    .lt("created_at", endDate);

  if (error) {
    console.error("Error fetching adoption:", error);
    throw error;
  }

  const totalAdoption = data.length;

  return totalAdoption;
};

export const getAdoptionStats = async (): Promise<DashboardAdoptionData> => {
  const supabase = await createClient();

  const { data: user, error: authError } = await supabase.auth.getUser();

  if (!user || authError) {
    throw new Error(authError?.message);
  }

  const currentDate = new Date();
  const previousMonthDate = new Date();
  previousMonthDate.setMonth(currentDate.getMonth() - 1);

  const currentMonthRange = getMonthRange(currentDate);
  const previousMonthRange = getMonthRange(previousMonthDate);

  const currentMonthAdoption = await fetchAdoption(
    user.user.id,
    currentMonthRange.gte,
    currentMonthRange.lt,
  );
  const previousMonthAdoption = await fetchAdoption(
    user.user.id,
    previousMonthRange.gte,
    previousMonthRange.lt,
  );

  const adoptionGrowth =
    previousMonthAdoption === 0
      ? 100
      : ((currentMonthAdoption - previousMonthAdoption) /
          previousMonthAdoption) *
        100;

  const growthRate = adoptionGrowth > 0 ? "up" : "down";

  return {
    previousMonthAdoption,
    currentMonthAdoption,
    adoptionGrowth,
    growthRate,
  };
};

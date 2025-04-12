"use server";

import { createClient } from "@/lib/supabase/server";
import { DashboardEngagementData } from "../../types";

const getMonthRange = (date: Date): { gte: string; lt: string } => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const gte = new Date(year, month, 1).toISOString();
  const lt = new Date(year, month + 1, 1).toISOString();
  return { gte, lt };
};

const fetchEngagement = async (
  userId: string,
  startDate: string,
  endDate: string,
): Promise<number> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select(
      `
      id,
      created_at,
      likes:likes(id, user_id),
      comments:comments(
        id,
        created_at,
        profiles:profiles(full_name, avatar_url)
      )
      `,
      { count: "exact" },
    )
    .eq("user_id", userId)
    .gte("created_at", startDate)
    .lt("created_at", endDate);

  if (error) {
    console.error("Error fetching engagement:", error);
    throw error;
  }

  const totalEngagement = data.reduce(
    (acc, post) => acc + post.likes.length + post.comments.length,
    0,
  );

  return totalEngagement;
};

export const getUserEngagement = async (): Promise<DashboardEngagementData> => {
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

  const currentMonthEngagement = await fetchEngagement(
    user.user.id,
    currentMonthRange.gte,
    currentMonthRange.lt,
  );
  const previousMonthEngagement = await fetchEngagement(
    user.user.id,
    previousMonthRange.gte,
    previousMonthRange.lt,
  );

  const engagementGrowth =
    previousMonthEngagement === 0
      ? 100
      : ((currentMonthEngagement - previousMonthEngagement) /
          previousMonthEngagement) *
        100;

  const growthRate: "up" | "down" = engagementGrowth > 0 ? "up" : "down";

  return {
    currentMonthEngagement,
    previousMonthEngagement,
    engagementGrowth,
    growthRate,
  };
};

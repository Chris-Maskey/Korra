"use server";

import { createClient } from "@/lib/supabase/server";

export const getUsers = async () => {
  const supabase = await createClient();

  const { data: user, error: authError } = await supabase.auth.getUser();

  if (!user || authError) {
    throw new Error(authError?.message);
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .not("id", "eq", user.user.id);

  if (error) {
    throw new Error(error.message);
  }

  if (data.length === 0) {
    throw new Error("No users found");
  }

  return data;
};

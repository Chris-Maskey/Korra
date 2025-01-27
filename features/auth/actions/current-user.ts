"use server";

import { createClient } from "@/lib/supabase/server";

export const currentUser = async () => {
  const supabase = await createClient();

  const { data: user, error } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not found");
  }

  if (error) {
    throw new Error(error.message);
  }

  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.user?.id)
    .single();

  if (profileError) {
    throw new Error(profileError.message);
  }

  return profileData;
};

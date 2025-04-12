"use server";

import { createClient } from "@/lib/supabase/server";

export const getPetShopLocations = async () => {
  const supabase = await createClient();

  const { data, error } = await supabase.from("locations").select("*");

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

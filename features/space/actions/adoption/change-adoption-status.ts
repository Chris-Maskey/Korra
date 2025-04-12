"use server";

import { Enums } from "@/database.types";
import { createClient } from "@/lib/supabase/server";

export type ChangeAdoptionStatusVariables = {
  adoptionId: string;
  adoptionStatus: Enums<"adoption_status">;
};

export const changeAdoptionStatus = async ({
  adoptionId,
  adoptionStatus,
}: ChangeAdoptionStatusVariables) => {
  const supabase = await createClient();

  const { error } = await supabase
    .from("adoption")
    .update({ adoption_status: adoptionStatus })
    .eq("id", adoptionId);

  if (error) {
    throw new Error("Failed to update adoption status: " + error.message);
  }
};

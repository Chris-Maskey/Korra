"use server";

import { createClient } from "@/lib/supabase/server";
import { adoptionSchema } from "../../schema";

export const createAdoption = async (
  data: (typeof adoptionSchema)["_output"],
) => {
  const supabase = await createClient();

  const { data: user, error: authError } = await supabase.auth.getUser();

  if (!user || authError) {
    throw new Error("You must be logged in to create a post");
  }

  let imageUrl: string | null = null;

  if (data.petImage) {
    const file = data.petImage;

    const fileName = `${user.user.id}/${crypto.randomUUID()}-${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from("posts")
      .upload(fileName, file);

    if (uploadError) {
      throw new Error("Failed to upload image: " + uploadError.message);
    }

    const { data: urlData } = supabase.storage
      .from("posts")
      .getPublicUrl(fileName);

    imageUrl = urlData.publicUrl;
  }

  if (!imageUrl) {
    throw new Error("Failed to obtain a public URL for the image");
  }

  const { data: adoptionData, error: postError } = await supabase
    .from("adoption")
    .insert({
      user_id: user.user.id,
      pet_name: data.petName,
      pet_type: data.petType,
      pet_age: data.petAge,
      pet_age_unit: data.petAgeUnit,
      pet_description: data.petDescription,
      image_url: imageUrl,
    })
    .select()
    .single();

  if (postError) {
    throw new Error("Failed to create post: " + postError.message);
  }

  return adoptionData;
};

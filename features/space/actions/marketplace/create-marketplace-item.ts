"use server";

import { createClient } from "@/lib/supabase/server";
import { marketplaceItemSchema } from "../../schema";

export const createMarketplaceItem = async (
  data: (typeof marketplaceItemSchema)["_output"],
) => {
  const supabase = await createClient();

  const { data: user, error: authError } = await supabase.auth.getUser();

  if (!user || authError) {
    throw new Error("You must be logged in to create a post");
  }

  let imageUrl: string | null = null;

  if (data.itemImage) {
    const file = data.itemImage;

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
    .from("marketplace")
    .insert({
      user_id: user.user.id,
      item_name: data.itemName,
      item_type: data.itemType,
      currency: data.currency,
      item_price: data.itemPrice,
      item_description: data.itemDescription,
      image_url: imageUrl,
    })
    .select()
    .single();

  if (postError) {
    throw new Error("Failed to create post: " + postError.message);
  }

  return adoptionData;
};

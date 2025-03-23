"use server";

import * as z from "zod";
import { createClient } from "@/lib/supabase/server";
import { Tables } from "@/database.types";
import { settingSchema } from "../schema";
import { revalidatePath } from "next/cache";

/**
 * Updates a user's profile information including avatar and banner images
 * @param data Form data from the settings form
 * @returns Updated user profile data
 */
export const updateUser = async (
  data: z.infer<typeof settingSchema>,
): Promise<Tables<"profiles">> => {
  try {
    const supabase = await createClient();

    // Authenticate user
    const { data: user, error: authError } = await supabase.auth.getUser();
    if (!user || authError) {
      throw new Error("You must be logged in to update your profile");
    }

    const userId = user.user.id;
    let avatarUrl = data.avatar_url || null;
    let bannerUrl = data.banner_url || null;

    // Handle avatar image upload
    if (data.avatar_image instanceof File) {
      const avatarPath = `${userId}/avatar-${crypto.randomUUID()}`;

      // Upload the file
      const { error: uploadError } = await supabase.storage
        .from("posts")
        .upload(avatarPath, data.avatar_image, {
          contentType: data.avatar_image.type,
          upsert: true,
        });

      if (uploadError) {
        throw new Error(`Avatar upload failed: ${uploadError.message}`);
      }

      // Get the public URL
      const { data: urlData } = supabase.storage
        .from("posts")
        .getPublicUrl(avatarPath);

      avatarUrl = urlData.publicUrl;
    }

    // Handle banner image upload
    if (data.banner_image instanceof File) {
      const bannerPath = `${userId}/banner-${crypto.randomUUID()}`;

      // Upload the file
      const { error: uploadError } = await supabase.storage
        .from("posts")
        .upload(bannerPath, data.banner_image, {
          contentType: data.banner_image.type,
          upsert: true,
        });

      if (uploadError) {
        throw new Error(`Banner upload failed: ${uploadError.message}`);
      }

      // Get the public URL
      const { data: urlData } = supabase.storage
        .from("posts")
        .getPublicUrl(bannerPath);

      bannerUrl = urlData.publicUrl;
    }

    // Process data for database update
    const processedData = {
      full_name: data.full_name,
      user_name: data.user_name,
      email: data.email,
      bio: data.bio === "" ? null : data.bio,
      website: data.website || null,
      instagram: data.instagram || null,
      twitter: data.twitter || null,
      avatar_url: avatarUrl,
      banner_url: bannerUrl,
      // Remove file objects as they can't be stored in the database
      avatar_image: undefined,
      banner_image: undefined,
    };

    // Fetch current user data
    const { data: currentUser, error: fetchError } = await supabase
      .from("profiles")
      .select("user_name, email")
      .eq("id", userId)
      .single();

    if (fetchError) {
      throw new Error(`Failed to fetch user data: ${fetchError.message}`);
    }

    // Check username availability if changed
    if (processedData.user_name !== currentUser.user_name) {
      const { count, error: usernameError } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .eq("user_name", processedData.user_name)
        .neq("id", userId);

      if (usernameError) {
        throw new Error(`Username check failed: ${usernameError.message}`);
      }

      if (count && count > 0) {
        throw new Error("Username is already taken");
      }
    }

    // Check email availability if changed
    if (processedData.email !== currentUser.email) {
      const { count, error: emailError } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .eq("email", processedData.email)
        .neq("id", userId);

      if (emailError) {
        throw new Error(`Email check failed: ${emailError.message}`);
      }

      if (count && count > 0) {
        throw new Error("Email is already in use");
      }
    }

    // Update user in database
    const { data: updatedUser, error: updateError } = await supabase
      .from("profiles")
      .update(processedData)
      .eq("id", userId)
      .select()
      .single();

    if (updateError) {
      throw new Error(`Update failed: ${updateError.message}`);
    }

    // Revalidate the profile page to show updated data
    revalidatePath(`/profiles/${processedData.user_name}`);
    revalidatePath("/settings");

    return updatedUser;
  } catch (error) {
    // Properly handle and rethrow errors
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("An unexpected error occurred while updating your profile");
  }
};

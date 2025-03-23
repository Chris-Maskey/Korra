"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function followUser(userId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to follow users" };
  }

  const { data: existingFollow } = await supabase
    .from("follows")
    .select()
    .eq("follower_id", user.id)
    .eq("following_id", userId)
    .single();

  if (existingFollow) {
    return { error: "Already following this user" };
  }

  const { error } = await supabase.from("follows").insert({
    follower_id: user.id,
    following_id: userId,
    created_at: new Date().toISOString(),
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/space/profile");
  revalidatePath(`/space/profile/${userId}`);
  revalidatePath(`/space/profile/${user.id}`);

  return { success: true };
}

export async function unfollowUser(userId: string) {
  const supabase = await createClient();

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to unfollow users" };
  }

  // Delete follow relationship
  const { error } = await supabase
    .from("follows")
    .delete()
    .eq("follower_id", user.id)
    .eq("following_id", userId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/users");
  revalidatePath(`/profile/${userId}`);
  revalidatePath(`/profile/${user.id}`);

  return { success: true };
}

export async function getFollowStatus(userId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { isFollowing: false, isCurrentUser: false };
  }

  if (user.id === userId) {
    return { isFollowing: false, isCurrentUser: true };
  }

  const { data } = await supabase
    .from("follows")
    .select()
    .eq("follower_id", user.id)
    .eq("following_id", userId)
    .single();

  return {
    isFollowing: !!data,
    isCurrentUser: false,
  };
}

export async function getFollowCounts(userId: string) {
  const supabase = await createClient();

  const { count: followersCount } = await supabase
    .from("follows")
    .select("*", { count: "exact", head: true })
    .eq("following_id", userId);

  const { count: followingCount } = await supabase
    .from("follows")
    .select("*", { count: "exact", head: true })
    .eq("follower_id", userId);

  return {
    followers: followersCount || 0,
    following: followingCount || 0,
  };
}

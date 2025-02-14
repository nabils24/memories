import supabase from "@/lib/supabase/config.js";

export async function createUser(userData) {
  const { data, error } = await supabase.from("user").insert([userData]);
  if (error) throw error;
  return data;
}

export async function getUser(userId) {
  const { data, error } = await supabase
    .from("user")
    .select("*")
    .eq("id", userId)
    .single();
  if (error) throw error;
  return data;
}
export async function getUserByUrl(url) {
  const { data, error } = await supabase
    .from("user")
    .select("*")
    .eq("uniq_url", url)
    .select()
  if (error) throw error;
  return data;
}

export async function updateUser(userId, userData) {
  const { data, error } = await supabase
    .from("user")
    .update(userData)
    .eq("user_id", userId);
  if (error) throw error;
  return data;
}

export async function deleteUser(userId) {
  const { data, error } = await supabase.from("user").delete().eq("id", userId);
  if (error) throw error;
  return data;
}

export default {
  createUser,
  getUser,
  getUserByUrl,
  updateUser,
  deleteUser,
};

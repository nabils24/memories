import supabase from "@/lib/supabase/config.js";

export async function getTitle() {
  const { data, error } = await supabase.from("title").select("*").limit(1);
  if (error) throw error;
  return data;
}
export async function getByUIDTitle(uuid) {
  const { data, error } = await supabase
    .from("title")
    .select("*")
    .match({ user_id: uuid })
    .limit(1);
  if (error) throw error;
  return data;
}

export async function createTitle(title) {
  const { data, error } = await supabase.from("title").insert(title);
  if (error) throw error;
  return data;
}

export async function updateTitle(id, updates) {
  const { data, error } = await supabase
    .from("title")
    .update(updates)
    .eq("id", id);
  if (error) throw error;
  return data;
}

export async function deleteTitle(id) {
  const { error } = await supabase.from("title").delete().match(id);
  if (error) throw error;
}

export default {
  getTitle,
  getByUIDTitle,
  createTitle,
  updateTitle,
  deleteTitle,
};

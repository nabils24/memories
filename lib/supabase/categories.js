import supabase from "@/lib/supabase/config.js";

export async function getCategories() {
  const { data, error } = await supabase.from("categories").select("*");
  if (error) throw error;
  return data;
}

export async function getByUIDCategories(uuid) {
  const { data, error } = await supabase.from("categories").select("*").match({ user_id: uuid });
  if (error) throw error;
  return data;
}

export async function createCategory(category) {
  const { data, error } = await supabase
    .from("categories")
    .insert(category)
    .select("*");
  if (error) throw error;
  return data;
}

export async function updateCategory(id, updates) {
  const { data, error } = await supabase
    .from("categories")
    .update(updates)
    .match({ id });
  if (error) throw error;
  return data;
}

export async function deleteCategory(id) {
  const { error } = await supabase.from("categories").delete().match({ id });
  if (error) throw error;
}

export default {
  getCategories,
  getByUIDCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};

import supabase from "@/lib/supabase/config.js";

export async function getMusic() {
  const { data, error } = await supabase.from("music").select("*");
  if (error) throw error;
  return data;
}

export async function createMusic(music) {
  const { data, error } = await supabase
    .from("music")
    .insert(music)
    .select("*");
  if (error) throw error;
  return data;
}

export async function updateMusic(id, updates) {
  const { data, error } = await supabase
    .from("music")
    .update(updates)
    .match({ id });
  if (error) throw error;
  return data;
}

export async function deleteMusic(id) {
  const { error } = await supabase.from("music").delete().match({ id });
  if (error) throw error;
}

export default { getMusic, createMusic, updateMusic, deleteMusic };

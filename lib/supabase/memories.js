import supabase from "@/lib/supabase/config.js";

export async function getMemories() {
  const { data, error } = await supabase.from("memories").select("*");
  if (error) throw error;
  return data;
}

export async function createMemory(memory) {
  const { data, error } = await supabase
    .from("memories")
    .insert(memory)
    .select("*");
  if (error) throw error;
  return data;
}

export async function updateMemory(id, updates) {
  const { data, error } = await supabase
    .from("memories")
    .update(updates)
    .match({ id });
  if (error) throw error;
  return data;
}

export async function deleteMemory(id) {
  const { error } = await supabase.from("memories").delete().match({ id });
  if (error) throw error;
}

export default { getMemories, createMemory, updateMemory, deleteMemory };

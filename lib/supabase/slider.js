import supabase from "@/lib/supabase/config.js";

export async function getSlider() {
  const { data, error } = await supabase.from("slider").select("*");
  if (error) throw error;
  return data;
}

export async function createSlider(Slider) {
  const { data, error } = await supabase.from("slider").insert(Slider);
  if (error) throw error;
  return data;
}

export async function updateSlider(id, updates) {
  const { data, error } = await supabase
    .from("Slider")
    .update(updates)
    .match({ id });
  if (error) throw error;
  return data;
}

export async function deleteSlider(id) {
  const { error } = await supabase.from("slider").delete().match({ id });
  if (error) throw error;
}

export default {
  getSlider,
  createSlider,
  updateSlider,
  deleteSlider,
};

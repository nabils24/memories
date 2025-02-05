import supabase from "@/lib/supabase/config.js";

export async function uploadMusic(file) {
  const uniqueName = `${Date.now()}_${Math.random()
    .toString(36)
    .substr(2, 9)}_${file.name}`;
  const { data, error } = await supabase.storage
    .from("music")
    .upload(uniqueName, file);

  if (error) throw error;
  return data;
}

export async function uploadPhoto(file) {
  const uniqueName = `${Date.now()}_${Math.random()
    .toString(36)
    .substr(2, 9)}_${file.name}`;
  const { data, error } = await supabase.storage
    .from("memories_photo")
    .upload(uniqueName, file);
  if (error) throw error;
  return data;
}

export async function uploadVideo(file) {
  const uniqueName = `${Date.now()}_${Math.random()
    .toString(36)
    .substr(2, 9)}_${file.name}`;
  const { data, error } = await supabase.storage
    .from("memories_video")
    .upload(uniqueName, file);
  if (error) throw error;
  return data;
}

export default { uploadMusic, uploadPhoto, uploadVideo };

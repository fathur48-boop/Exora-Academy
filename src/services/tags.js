import { supabase } from "@/lib/supabase.js";

export async function listTags() {
  const { data, error } = await supabase.from("tags").select("*").order("name");
  if (error) throw error;
  return data;
}

export async function getTagBySlug(slug) {
  const { data, error } = await supabase.from("tags").select("*").eq("slug", slug).single();
  if (error) throw error;
  return data;
}

export async function createTag(payload) {
  const { data, error } = await supabase.from("tags").insert(payload).select().single();
  if (error) throw error;
  return data;
}

export async function deleteTag(id) {
  const { error } = await supabase.from("tags").delete().eq("id", id);
  if (error) throw error;
}

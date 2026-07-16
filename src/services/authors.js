import { supabase } from "@/lib/supabase.js";

export async function listAuthors() {
  const { data, error } = await supabase.from("authors").select("*").order("name");
  if (error) throw error;
  return data;
}

export async function createAuthor(payload) {
  const { data, error } = await supabase.from("authors").insert(payload).select().single();
  if (error) throw error;
  return data;
}

export async function updateAuthor(id, payload) {
  const { data, error } = await supabase.from("authors").update(payload).eq("id", id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteAuthor(id) {
  const { error } = await supabase.from("authors").delete().eq("id", id);
  if (error) throw error;
}

import { supabase } from "@/lib/supabase.js";

export async function listRedirects() {
  const { data, error } = await supabase.from("redirects").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

/** Dicek saat artikel 404 di ArticleLayout, sebelum render halaman NotFound. */
export async function findRedirect(oldPath) {
  const { data, error } = await supabase.from("redirects").select("*").eq("old_path", oldPath).maybeSingle();
  if (error) throw error;
  return data;
}

/** Dipanggil manual oleh admin dari editor artikel saat mengganti slug. */
export async function createRedirect({ old_path, new_path, status_code = 301 }) {
  const { data, error } = await supabase
    .from("redirects")
    .insert({ old_path, new_path, status_code })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteRedirect(id) {
  const { error } = await supabase.from("redirects").delete().eq("id", id);
  if (error) throw error;
}

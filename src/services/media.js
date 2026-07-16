import { supabase } from "@/lib/supabase.js";

/** Buckets sesuai blueprint: covers, content, authors, logos, icons, uploads */
export const MEDIA_BUCKETS = ["covers", "content", "authors", "logos", "icons", "uploads"];

export async function uploadMedia(bucket, file, path) {
  const filePath = path || `${Date.now()}-${file.name}`;
  const { error } = await supabase.storage.from(bucket).upload(filePath, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw error;

  const { data: publicUrl } = supabase.storage.from(bucket).getPublicUrl(filePath);

  const { data, error: dbError } = await supabase
    .from("media")
    .insert({
      bucket,
      path: filePath,
      url: publicUrl.publicUrl,
      file_name: file.name,
      mime_type: file.type,
      size_bytes: file.size,
    })
    .select()
    .single();
  if (dbError) throw dbError;
  return data;
}

export async function listMedia(bucket) {
  let query = supabase.from("media").select("*").order("created_at", { ascending: false });
  if (bucket) query = query.eq("bucket", bucket);
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function deleteMedia(mediaRow) {
  const { error: storageError } = await supabase.storage.from(mediaRow.bucket).remove([mediaRow.path]);
  if (storageError) throw storageError;
  const { error } = await supabase.from("media").delete().eq("id", mediaRow.id);
  if (error) throw error;
}

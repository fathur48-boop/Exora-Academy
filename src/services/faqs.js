import { supabase } from "@/lib/supabase.js";

export async function listFaqsByArticle(articleId) {
  const { data, error } = await supabase
    .from("faqs")
    .select("*")
    .eq("article_id", articleId)
    .order("sort_order");
  if (error) throw error;
  return data;
}

/** Replace semua FAQ artikel dengan set baru (dipanggil dari editor saat save). */
export async function replaceArticleFaqs(articleId, faqs) {
  await supabase.from("faqs").delete().eq("article_id", articleId);
  if (!faqs.length) return;
  const rows = faqs.map((f, i) => ({
    article_id: articleId,
    question: f.question,
    answer: f.answer,
    sort_order: i,
  }));
  const { error } = await supabase.from("faqs").insert(rows);
  if (error) throw error;
}

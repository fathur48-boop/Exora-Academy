import { supabase } from "@/lib/supabase.js";

const ARTICLE_SELECT = `
  id, title, slug, excerpt, content, cover_url, status,
  meta_title, meta_description,
  published_at, updated_at, created_at, views,
  author:authors(id, name, slug, avatar_url, bio),
  category:categories(id, name, slug),
  article_tags(tag:tags(id, name, slug))
`;

/** List artikel published untuk halaman publik, dengan filter kategori/tag opsional. */
export async function listPublishedArticles({ categorySlug, tagSlug, limit = 12, page = 1 } = {}) {
  let query = supabase
    .from("articles")
    .select(ARTICLE_SELECT, { count: "exact" })
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  if (categorySlug) query = query.eq("category.slug", categorySlug);

  const { data, error, count } = await query;
  if (error) throw error;

  let rows = data || [];
  if (tagSlug) {
    rows = rows.filter((a) => a.article_tags?.some((t) => t.tag?.slug === tagSlug));
  }
  return { rows, count };
}

/** Artikel terpopuler berdasarkan views. */
export async function listPopularArticles(limit = 5) {
  const { data, error } = await supabase
    .from("articles")
    .select(ARTICLE_SELECT)
    .eq("status", "published")
    .order("views", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data;
}

/** Satu artikel by kategori slug + artikel slug (untuk halaman /:kategori/:slug). */
export async function getArticleBySlug(categorySlug, slug) {
  const { data, error } = await supabase
    .from("articles")
    .select(`${ARTICLE_SELECT}, faqs(id, question, answer, sort_order)`)
    .eq("slug", slug)
    .eq("status", "published")
    .single();
  if (error) throw error;
  if (data.category?.slug !== categorySlug) return null;
  return data;
}

/** Artikel terkait: kategori sama, exclude diri sendiri. */
export async function listRelatedArticles(categoryId, excludeId, limit = 4) {
  const { data, error } = await supabase
    .from("articles")
    .select(ARTICLE_SELECT)
    .eq("status", "published")
    .eq("category_id", categoryId)
    .neq("id", excludeId)
    .order("published_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data;
}

/** Full text search (Postgres FTS) di title + content. */
export async function searchArticles(q, limit = 20) {
  if (!q?.trim()) return [];
  const { data, error } = await supabase
    .from("articles")
    .select(ARTICLE_SELECT)
    .eq("status", "published")
    .textSearch("fts", q, { type: "websearch", config: "indonesian" })
    .limit(limit);
  if (error) throw error;
  return data;
}

/** Increment view count (dipanggil di halaman artikel, dan dicatat ke article_views). */
export async function recordArticleView(articleId) {
  await supabase.rpc("increment_article_views", { p_article_id: articleId });
}

// ---------- Admin CRUD ----------

export async function listAllArticles({ status } = {}) {
  let query = supabase.from("articles").select(ARTICLE_SELECT).order("created_at", { ascending: false });
  if (status) query = query.eq("status", status);
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getArticleById(id) {
  const { data, error } = await supabase
    .from("articles")
    .select(`${ARTICLE_SELECT}, faqs(id, question, answer, sort_order)`)
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
}

export async function createArticle(payload) {
  const { data, error } = await supabase.from("articles").insert(payload).select().single();
  if (error) throw error;
  return data;
}

export async function updateArticle(id, payload) {
  const { data, error } = await supabase.from("articles").update(payload).eq("id", id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteArticle(id) {
  const { error } = await supabase.from("articles").delete().eq("id", id);
  if (error) throw error;
}

export async function setArticleTags(articleId, tagIds) {
  await supabase.from("article_tags").delete().eq("article_id", articleId);
  if (!tagIds.length) return;
  const rows = tagIds.map((tag_id) => ({ article_id: articleId, tag_id }));
  const { error } = await supabase.from("article_tags").insert(rows);
  if (error) throw error;
}

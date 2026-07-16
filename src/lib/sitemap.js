import { supabase } from "./supabase.js";
import { SITE_URL } from "./seo.js";

/** Ambil semua artikel published + kategori untuk keperluan preview sitemap di admin. */
export async function fetchSitemapEntries() {
  const { data: articles, error: articleErr } = await supabase
    .from("articles")
    .select("slug, updated_at, published_at, category:categories(slug)")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (articleErr) throw articleErr;

  const { data: categories, error: catErr } = await supabase
    .from("categories")
    .select("slug, updated_at");

  if (catErr) throw catErr;

  const articleUrls = (articles || []).map((a) => ({
    loc: `${SITE_URL}/${a.category?.slug}/${a.slug}`,
    lastmod: a.updated_at || a.published_at,
  }));

  const categoryUrls = (categories || []).map((c) => ({
    loc: `${SITE_URL}/kategori/${c.slug}`,
    lastmod: c.updated_at,
  }));

  return [{ loc: `${SITE_URL}/`, lastmod: new Date().toISOString() }, ...categoryUrls, ...articleUrls];
}

export function toSitemapXml(entries) {
  const body = entries
    .map(
      (e) => `  <url>\n    <loc>${e.loc}</loc>\n    <lastmod>${e.lastmod?.slice(0, 10) || ""}</lastmod>\n  </url>`
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

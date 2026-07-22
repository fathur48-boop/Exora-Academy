// Dijalankan otomatis setelah `vite build` (lihat package.json > scripts.build).
// Ambil semua artikel published + kategori dari Supabase, tulis public sitemap ke dist/.
import { createClient } from "@supabase/supabase-js";
import { writeFileSync } from "fs";
import "dotenv/config";

const SITE_URL = process.env.VITE_SITE_URL || "https://www.myexora.my.id";
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function main() {
  const { data: articles, error: articleErr } = await supabase
    .from("articles")
    .select("slug, updated_at, published_at, category:categories(slug)")
    .eq("status", "published");

  const { data: categories, error: catErr } = await supabase
    .from("categories")
    .select("slug, updated_at");

  if (articleErr || catErr) {
    // JANGAN silent skip. Bikin build gagal biar ketauan langsung di Vercel,
    // daripada diem-diem ke-deploy pake placeholder dari public/sitemap.xml.
    console.error("[sitemap] gagal ambil data dari Supabase:");
    if (articleErr) console.error(" - articles error:", articleErr.message || articleErr);
    if (catErr) console.error(" - categories error:", catErr.message || catErr);
    process.exit(1);
  }

  const urls = [
    { loc: `${SITE_URL}/`, lastmod: new Date().toISOString() },
    ...(categories || []).map((c) => ({
      loc: `${SITE_URL}/kategori/${c.slug}`,
      lastmod: c.updated_at,
    })),
    ...(articles || []).map((a) => ({
      loc: `${SITE_URL}/${a.category?.slug}/${a.slug}`,
      lastmod: a.updated_at || a.published_at,
    })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map(
      (u) =>
        `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${(u.lastmod || "").slice(0, 10)}</lastmod>\n  </url>`
    )
    .join("\n")}\n</urlset>\n`;

  writeFileSync("dist/sitemap.xml", xml);
  console.log(`[sitemap] generated with ${urls.length} URLs -> dist/sitemap.xml`);
}

main().catch((err) => {
  // Jaga-jaga kalau ada error yang gak ketangkep di atas (network timeout, dll)
  console.error("[sitemap] unhandled error:", err);
  process.exit(1);
});

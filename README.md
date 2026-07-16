# Exora Academy

Blog/knowledge SEO untuk UMKM Indonesia — React 19 + Vite + Supabase.

## Setup

```bash
npm install
cp .env.example .env.local   # isi VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY
```

### Database

1. Buat project baru di [Supabase](https://supabase.com).
2. Buka SQL Editor, jalankan isi `supabase/migrations/0001_init.sql`.
3. Buat 1 user admin lewat Authentication > Users (email + password) — ini satu-satunya role yang dipakai untuk login `/admin`.

### Jalankan lokal

```bash
npm run dev
```

### Build & deploy (Vercel)

```bash
npm run build
```

`npm run build` otomatis menjalankan `scripts/generate-sitemap.js` setelah build, yang mengambil semua artikel published dari Supabase dan menulis `dist/sitemap.xml`. Pastikan env var `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, dan `VITE_SITE_URL` sudah diset di Vercel project settings.

## Struktur

Lihat `src/` — dibagi jadi `pages`, `components` (per domain: navbar, article, admin, dll), `services` (data access ke Supabase per tabel), `lib` (supabase client, seo helper, sitemap helper), `hooks`, `utils`, `constants`.

## Routing

- Publik: `/`, `/kategori`, `/kategori/:slug`, `/tag/:slug`, `/search`, `/about`, `/contact`, `/privacy`, `/terms`
- Artikel: `/:kategori/:slug` (contoh: `/jualan-online/cara-jualan-online-tanpa-modal`)
- Admin (butuh login): `/admin/*` — menu lengkap di sidebar (Dashboard, Artikel, Draft, Kategori, Tag, Media, Author, SEO, Redirect, Sitemap, Settings)

## Catatan implementasi

- **Reading time & TOC**: auto-generate dari heading (`h2`/`h3`) di isi artikel — lihat `src/utils/content.js`.
- **Redirect**: diisi manual oleh admin. Saat mengganti slug/kategori artikel di editor, sistem otomatis menawarkan untuk membuat redirect 301.
- **Search**: pakai PostgreSQL Full Text Search (`fts` generated column, config `indonesian`) di tabel `articles`. Nanti tinggal ganti `searchArticles()` di `src/services/articles.js` kalau upgrade ke Meilisearch/Algolia.
- **SEO**: meta tag, Open Graph, Twitter Card, dan JSON-LD schema (Article, FAQ, Breadcrumb, Organization) di-render lewat `SeoHead` (`react-helmet-async`). Sitemap dibuat saat build, robots.txt statis di `public/`.
- **Auth admin**: role tunggal (admin), pakai Supabase Auth email/password. Tidak ada level editor terpisah.

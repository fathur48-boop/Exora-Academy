import { buildMeta } from "@/lib/seo.js";

/**
 * Komponen serbaguna untuk semua meta tag SEO satu halaman:
 * title, description, canonical, OG, Twitter Card, + JSON-LD schema tambahan.
 *
 * React 19 secara otomatis meng-hoist <title>, <meta>, <link>, dan <script>
 * yang dirender di mana saja dalam tree ke <head> — jadi tidak perlu
 * react-helmet-async lagi.
 */
export default function SeoHead({ title, description, path, image, type, noindex, schemas = [] }) {
  const meta = buildMeta({ title, description, path, image, type, noindex });

  return (
    <>
      <title>{meta.fullTitle}</title>
      <meta name="description" content={meta.description} />
      <link rel="canonical" href={meta.url} />
      {meta.noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:site_name" content={meta.siteName} />
      <meta property="og:title" content={meta.fullTitle} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:url" content={meta.url} />
      <meta property="og:image" content={meta.image} />
      <meta property="og:type" content={meta.type} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={meta.fullTitle} />
      <meta name="twitter:description" content={meta.description} />
      <meta name="twitter:image" content={meta.image} />

      {schemas
        .filter(Boolean)
        .map((schema, i) => (
          <script key={i} type="application/ld+json">
            {JSON.stringify(schema)}
          </script>
        ))}
    </>
  );
}

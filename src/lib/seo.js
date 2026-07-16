const SITE_NAME = "Exora Academy";
const SITE_URL = import.meta.env.VITE_SITE_URL || "https://myexora.my.id";
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-default.jpg`;

/** Bangun object meta dasar untuk sebuah halaman. */
export function buildMeta({
  title,
  description,
  path = "/",
  image = DEFAULT_OG_IMAGE,
  type = "website",
  noindex = false,
}) {
  const url = `${SITE_URL}${path}`;
  const fullTitle = title ? `${title} — ${SITE_NAME}` : SITE_NAME;
  return { fullTitle, description, url, image, type, noindex, siteName: SITE_NAME };
}

/** JSON-LD Article schema */
export function articleSchema(article) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    image: article.cover_url ? [article.cover_url] : undefined,
    datePublished: article.published_at,
    dateModified: article.updated_at || article.published_at,
    author: {
      "@type": "Person",
      name: article.author?.name,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/${article.category_slug}/${article.slug}`,
    },
  };
}

/** JSON-LD FAQPage schema */
export function faqSchema(faqs = []) {
  if (!faqs.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/** JSON-LD BreadcrumbList schema */
export function breadcrumbSchema(items = []) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

/** JSON-LD Organization schema (dipakai global, sekali di layout) */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    sameAs: [],
  };
}

export { SITE_URL, SITE_NAME };

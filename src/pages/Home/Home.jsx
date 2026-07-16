import Hero from "@/components/hero/Hero.jsx";
import CategoryGrid from "@/components/category/CategoryGrid.jsx";
import ArticleSection from "@/components/article/ArticleSection.jsx";
import NewsletterCta from "@/components/newsletter/NewsletterCta.jsx";
import ExoraCta from "@/components/article/ExoraCta.jsx";
import SeoHead from "@/components/seo/SeoHead.jsx";
import { organizationSchema } from "@/lib/seo.js";
import { useAsync } from "@/hooks/useAsync.js";
import { listCategories } from "@/services/categories.js";
import { listPublishedArticles, listPopularArticles } from "@/services/articles.js";

export default function Home() {
  const { data: categories } = useAsync(() => listCategories(), []);
  const { data: latest, isLoading: latestLoading } = useAsync(
    () => listPublishedArticles({ limit: 8 }).then((r) => r.rows),
    []
  );
  const { data: popular, isLoading: popularLoading } = useAsync(() => listPopularArticles(4), []);
  const { data: guides, isLoading: guidesLoading } = useAsync(
    () => listPublishedArticles({ categorySlug: "panduan-lengkap", limit: 4 }).then((r) => r.rows),
    []
  );
  const { data: aiArticles, isLoading: aiLoading } = useAsync(
    () => listPublishedArticles({ categorySlug: "ai", limit: 4 }).then((r) => r.rows),
    []
  );

  return (
    <>
      <SeoHead
        title={null}
        description="Panduan praktis jualan online, marketing, dan AI untuk UMKM Indonesia. Belajar gratis, langsung praktik."
        path="/"
        schemas={[organizationSchema()]}
      />

      <Hero />
      <CategoryGrid categories={categories} />
      <ArticleSection title="Artikel Terbaru" articles={latest} isLoading={latestLoading} />
      <ArticleSection title="Artikel Populer" articles={popular} isLoading={popularLoading} />
      <ArticleSection title="Panduan Lengkap" articles={guides} isLoading={guidesLoading} />
      <ArticleSection title="AI untuk UMKM" articles={aiArticles} isLoading={aiLoading} />

      {/* Template Gratis */}
      <section className="container-page py-10">
        <div className="rounded-2xl border border-line bg-white p-8 text-center sm:p-12">
          <p className="eyebrow">Template Gratis</p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-ink">
            Download template caption, kalender konten, dan checklist jualan
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-sm text-muted">
            Semua template siap pakai, tinggal edit sesuai brand kamu.
          </p>
        </div>
      </section>

      <section className="container-page py-10">
        <ExoraCta />
      </section>

      <section className="container-page pb-16">
        <NewsletterCta />
      </section>
    </>
  );
}

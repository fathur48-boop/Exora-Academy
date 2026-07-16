import { useParams } from "react-router-dom";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb.jsx";
import ArticleCard from "@/components/article/ArticleCard.jsx";
import CategoryGrid from "@/components/category/CategoryGrid.jsx";
import SeoHead from "@/components/seo/SeoHead.jsx";
import { breadcrumbSchema } from "@/lib/seo.js";
import { Skeleton } from "@/components/ui/Card.jsx";
import { EmptyState } from "@/components/ui/Card.jsx";
import { useAsync } from "@/hooks/useAsync.js";
import { listCategories, getCategoryBySlug } from "@/services/categories.js";
import { listPublishedArticles } from "@/services/articles.js";

export default function Category() {
  const { slug } = useParams();

  if (!slug) return <CategoryIndex />;
  return <CategoryDetail slug={slug} />;
}

function CategoryIndex() {
  const { data: categories, isLoading } = useAsync(() => listCategories(), []);

  return (
    <>
      <SeoHead title="Semua Kategori" description="Jelajahi semua topik panduan Exora Academy." path="/kategori" />
      <div className="container-page py-8">
        <Breadcrumb items={[{ label: "Beranda", path: "/" }, { label: "Kategori", path: "/kategori" }]} />
      </div>
      {isLoading ? (
        <div className="container-page grid gap-4 pb-16 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      ) : (
        <CategoryGrid categories={categories} />
      )}
    </>
  );
}

function CategoryDetail({ slug }) {
  const { data: category } = useAsync(() => getCategoryBySlug(slug), [slug]);
  const { data: articles, isLoading } = useAsync(
    () => listPublishedArticles({ categorySlug: slug, limit: 24 }).then((r) => r.rows),
    [slug]
  );

  return (
    <>
      <SeoHead
        title={category?.name || slug}
        description={category?.description || `Kumpulan panduan tentang ${slug} untuk UMKM.`}
        path={`/kategori/${slug}`}
        schemas={[
          breadcrumbSchema([
            { label: "Beranda", path: "/" },
            { label: "Kategori", path: "/kategori" },
            { label: category?.name || slug, path: `/kategori/${slug}` },
          ]),
        ]}
      />

      <div className="container-page py-8">
        <Breadcrumb
          items={[
            { label: "Beranda", path: "/" },
            { label: "Kategori", path: "/kategori" },
            { label: category?.name || slug, path: `/kategori/${slug}` },
          ]}
        />
        <h1 className="mt-3 font-display text-3xl font-semibold text-ink">{category?.name || slug}</h1>
        {category?.description && <p className="mt-2 max-w-2xl text-muted">{category.description}</p>}
      </div>

      <div className="container-page pb-16">
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-64" />
            ))}
          </div>
        ) : articles?.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {articles.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        ) : (
          <EmptyState title="Belum ada artikel" description="Artikel untuk kategori ini akan segera hadir." />
        )}
      </div>
    </>
  );
}

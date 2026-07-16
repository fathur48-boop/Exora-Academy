import { useParams } from "react-router-dom";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb.jsx";
import ArticleCard from "@/components/article/ArticleCard.jsx";
import { EmptyState, Skeleton } from "@/components/ui/Card.jsx";
import SeoHead from "@/components/seo/SeoHead.jsx";
import { useAsync } from "@/hooks/useAsync.js";
import { getTagBySlug } from "@/services/tags.js";
import { listPublishedArticles } from "@/services/articles.js";

export default function Tag() {
  const { slug } = useParams();
  const { data: tag } = useAsync(() => getTagBySlug(slug), [slug]);
  const { data: articles, isLoading } = useAsync(
    () => listPublishedArticles({ tagSlug: slug, limit: 24 }).then((r) => r.rows),
    [slug]
  );

  return (
    <>
      <SeoHead title={`Tag: ${tag?.name || slug}`} description={`Artikel dengan tag ${tag?.name || slug}.`} path={`/tag/${slug}`} />

      <div className="container-page py-8">
        <Breadcrumb items={[{ label: "Beranda", path: "/" }, { label: `#${tag?.name || slug}`, path: `/tag/${slug}` }]} />
        <h1 className="mt-3 font-display text-3xl font-semibold text-ink">#{tag?.name || slug}</h1>
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
          <EmptyState title="Belum ada artikel" description="Belum ada artikel untuk tag ini." />
        )}
      </div>
    </>
  );
}

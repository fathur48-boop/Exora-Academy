import { useEffect, useState } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb.jsx";
import Toc from "@/components/toc/Toc.jsx";
import Faq from "@/components/faq/Faq.jsx";
import RelatedArticles from "@/components/related/RelatedArticles.jsx";
import AuthorCard from "@/components/author/AuthorCard.jsx";
import ShareButtons from "@/components/article/ShareButtons.jsx";
import ExoraCta from "@/components/article/ExoraCta.jsx";
import SeoHead from "@/components/seo/SeoHead.jsx";
import { Skeleton } from "@/components/ui/Card.jsx";
import { articleSchema, faqSchema, breadcrumbSchema, SITE_URL } from "@/lib/seo.js";
import { calcReadingTime, extractToc, injectHeadingIds, formatDate } from "@/utils/content.js";
import { getArticleBySlug, listRelatedArticles, recordArticleView } from "@/services/articles.js";
import { findRedirect } from "@/services/redirects.js";

export default function Article() {
  const { kategori, slug } = useParams();
  const navigate = useNavigate();

  const [article, setArticle] = useState(undefined); // undefined = loading, null = not found
  const [related, setRelated] = useState([]);
  const [redirectTo, setRedirectTo] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setArticle(undefined);
      try {
        const data = await getArticleBySlug(kategori, slug);
        if (cancelled) return;

        if (!data) {
          // Artikel tidak ketemu / kategori tidak cocok — cek redirect manual sebelum 404.
          const redirect = await findRedirect(`/${kategori}/${slug}`);
          if (redirect) {
            setRedirectTo(redirect.new_path);
          } else {
            setArticle(null);
          }
          return;
        }

        setArticle(data);
        recordArticleView(data.id).catch(() => {});
        const relatedRows = await listRelatedArticles(data.category?.id, data.id);
        if (!cancelled) setRelated(relatedRows);
      } catch {
        if (!cancelled) setArticle(null);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [kategori, slug]);

  if (redirectTo) return <Navigate to={redirectTo} replace />;

  if (article === undefined) return <ArticleSkeleton />;
  if (article === null) return <Navigate to="/404" replace />;

  const html = injectHeadingIds(article.content || "");
  const toc = extractToc(article.content || "");
  const readingTime = calcReadingTime(article.content || "");
  const url = `${SITE_URL}/${kategori}/${slug}`;
  const tags = (article.article_tags || []).map((t) => t.tag).filter(Boolean);

  return (
    <>
      <SeoHead
        title={article.title}
        description={article.excerpt}
        path={`/${kategori}/${slug}`}
        image={article.cover_url}
        type="article"
        schemas={[
          articleSchema({ ...article, category_slug: kategori }),
          faqSchema(article.faqs),
          breadcrumbSchema([
            { label: "Beranda", path: "/" },
            { label: article.category?.name, path: `/kategori/${kategori}` },
            { label: article.title, path: `/${kategori}/${slug}` },
          ]),
        ]}
      />

      {/* Hero */}
      <div className="border-b border-line bg-white">
        <div className="container-page py-8">
          <Breadcrumb
            items={[
              { label: "Beranda", path: "/" },
              { label: article.category?.name, path: `/kategori/${kategori}` },
              { label: article.title, path: url },
            ]}
          />
          <p className="eyebrow mt-4">{article.category?.name}</p>
          <h1 className="mt-2 max-w-3xl font-display text-3xl font-semibold leading-tight text-ink sm:text-4xl">
            {article.title}
          </h1>

          <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
            <AuthorCard author={article.author} />
            <div className="text-xs text-muted">
              <span>{formatDate(article.published_at)}</span>
              <span className="mx-2">·</span>
              <span>{readingTime} menit baca</span>
            </div>
          </div>
        </div>

        {article.cover_url && (
          <div className="container-page pb-8">
            <img src={article.cover_url} alt={article.title} className="aspect-[21/9] w-full rounded-2xl object-cover" />
          </div>
        )}
      </div>

      {/* Body */}
      <div className="container-page grid gap-10 py-10 lg:grid-cols-[1fr,280px]">
        <article>
          <div className="prose-article" dangerouslySetInnerHTML={{ __html: html }} />

          {tags.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <a
                  key={tag.id}
                  href={`/tag/${tag.slug}`}
                  className="rounded-full border border-line px-3 py-1 text-xs font-medium text-muted hover:border-brand hover:text-brand"
                >
                  #{tag.name}
                </a>
              ))}
            </div>
          )}

          <div className="mt-6">
            <ShareButtons url={url} title={article.title} />
          </div>

          <Faq items={article.faqs} />

          <div className="mt-12">
            <ExoraCta />
          </div>

          <RelatedArticles articles={related} />
        </article>

        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-6">
            <Toc items={toc} />
          </div>
        </aside>
      </div>
    </>
  );
}

function ArticleSkeleton() {
  return (
    <div className="container-page py-10">
      <Skeleton className="h-4 w-40" />
      <Skeleton className="mt-4 h-10 w-3/4" />
      <Skeleton className="mt-6 aspect-[21/9] w-full" />
      <div className="mt-8 space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
      </div>
    </div>
  );
}

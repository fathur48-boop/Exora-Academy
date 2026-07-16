import { Link } from "react-router-dom";
import { formatDate } from "@/utils/content.js";

export default function ArticleCard({ article }) {
  const href = `/${article.category?.slug}/${article.slug}`;
  return (
    <Link to={href} className="group block">
      <div className="aspect-[16/10] overflow-hidden rounded-xl bg-ink/5">
        {article.cover_url && (
          <img
            src={article.cover_url}
            alt={article.title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        )}
      </div>
      <p className="eyebrow mt-3">{article.category?.name}</p>
      <h3 className="mt-1 font-display text-lg font-semibold leading-snug text-ink group-hover:text-brand">
        {article.title}
      </h3>
      {article.excerpt && <p className="mt-1.5 line-clamp-2 text-sm text-muted">{article.excerpt}</p>}
      <p className="mt-2 text-xs text-muted">{formatDate(article.published_at)}</p>
    </Link>
  );
}

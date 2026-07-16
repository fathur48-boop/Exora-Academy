import ArticleCard from "@/components/article/ArticleCard.jsx";

export default function RelatedArticles({ articles }) {
  if (!articles?.length) return null;
  return (
    <section className="mt-14">
      <h2 className="font-display text-xl font-semibold text-ink">Artikel Terkait</h2>
      <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {articles.map((a) => (
          <ArticleCard key={a.id} article={a} />
        ))}
      </div>
    </section>
  );
}

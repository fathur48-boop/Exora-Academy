import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import SearchBar from "@/components/search/SearchBar.jsx";
import ArticleCard from "@/components/article/ArticleCard.jsx";
import { EmptyState, Skeleton } from "@/components/ui/Card.jsx";
import SeoHead from "@/components/seo/SeoHead.jsx";
import { useDebounce } from "@/hooks/useDebounce.js";
import { searchArticles } from "@/services/articles.js";

export default function Search() {
  const [params, setParams] = useSearchParams();
  const [q, setQ] = useState(params.get("q") || "");
  const debouncedQ = useDebounce(q, 400);
  const [results, setResults] = useState([]);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setParams(debouncedQ ? { q: debouncedQ } : {}, { replace: true });
    if (!debouncedQ.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    searchArticles(debouncedQ)
      .then(setResults)
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQ]);

  return (
    <>
      <SeoHead title="Cari Artikel" description="Cari panduan jualan online, marketing, dan AI untuk UMKM." path="/search" noindex />

      <div className="container-page py-10">
        <h1 className="font-display text-2xl font-semibold text-ink">Cari Artikel</h1>
        <div className="mt-5 max-w-xl">
          <SearchBar value={q} onChange={setQ} />
        </div>

        <div className="mt-10">
          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-56" />
              ))}
            </div>
          ) : !debouncedQ.trim() ? (
            <EmptyState title="Mulai ketik untuk mencari" description="Coba cari topik seperti 'jualan online' atau 'copywriting'." />
          ) : results.length === 0 ? (
            <EmptyState title={`Tidak ada hasil untuk "${debouncedQ}"`} description="Coba kata kunci lain yang lebih umum." />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

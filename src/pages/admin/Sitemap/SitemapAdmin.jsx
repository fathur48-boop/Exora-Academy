import { useState } from "react";
import { RefreshCw, Download } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader.jsx";
import Button from "@/components/ui/Button.jsx";
import { fetchSitemapEntries, toSitemapXml } from "@/lib/sitemap.js";

export default function SitemapAdmin() {
  const [entries, setEntries] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    setLoading(true);
    try {
      const rows = await fetchSitemapEntries();
      setEntries(rows);
    } finally {
      setLoading(false);
    }
  }

  function handleDownload() {
    if (!entries) return;
    const xml = toSitemapXml(entries);
    const blob = new Blob([xml], { type: "application/xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sitemap.xml";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <PageHeader
        title="Sitemap"
        description="Sitemap.xml resmi dibuat otomatis tiap kali situs di-build & deploy (lihat scripts/generate-sitemap.js). Di sini kamu bisa preview isinya kapan saja."
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleGenerate} disabled={loading}>
              <RefreshCw size={15} /> {loading ? "Memuat…" : "Refresh Preview"}
            </Button>
            {entries && (
              <Button onClick={handleDownload}>
                <Download size={15} /> Download XML
              </Button>
            )}
          </div>
        }
      />

      {!entries ? (
        <p className="rounded-2xl border border-dashed border-line px-6 py-14 text-center text-sm text-muted">
          Klik "Refresh Preview" untuk melihat semua URL yang akan masuk sitemap.
        </p>
      ) : (
        <div className="rounded-2xl border border-line bg-white">
          <div className="divide-y divide-line">
            {entries.map((e) => (
              <div key={e.loc} className="flex items-center justify-between px-4 py-2.5 text-sm">
                <span className="font-mono text-xs text-ink">{e.loc}</span>
                <span className="text-xs text-muted">{e.lastmod?.slice(0, 10)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

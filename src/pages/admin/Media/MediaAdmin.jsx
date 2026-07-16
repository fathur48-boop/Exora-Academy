import { useState } from "react";
import { Upload, Trash2, Copy } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader.jsx";
import { Select } from "@/components/ui/Input.jsx";
import { EmptyState } from "@/components/ui/Card.jsx";
import { useAsync } from "@/hooks/useAsync.js";
import { listMedia, uploadMedia, deleteMedia, MEDIA_BUCKETS } from "@/services/media.js";

export default function MediaAdmin() {
  const [bucket, setBucket] = useState("");
  const { data: media, isLoading, refetch } = useAsync(() => listMedia(bucket || undefined), [bucket]);
  const [uploading, setUploading] = useState(false);

  async function handleUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      await uploadMedia(bucket || "uploads", file);
      refetch();
    } catch (err) {
      alert("Upload gagal: " + err.message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleDelete(row) {
    if (!confirm("Hapus file ini?")) return;
    await deleteMedia(row);
    refetch();
  }

  function copyUrl(url) {
    navigator.clipboard.writeText(url);
  }

  return (
    <>
      <PageHeader
        title="Media"
        description="Kelola file gambar di semua bucket (covers, content, authors, logos, icons, uploads)."
        action={
          <label className="btn-primary cursor-pointer">
            <Upload size={15} />
            {uploading ? "Mengunggah…" : "Upload File"}
            <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
          </label>
        }
      />

      <div className="mb-5 max-w-xs">
        <Select label="Filter Bucket" value={bucket} onChange={(e) => setBucket(e.target.value)}>
          <option value="">Semua bucket</option>
          {MEDIA_BUCKETS.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </Select>
      </div>

      {!isLoading && !media?.length && (
        <EmptyState title="Belum ada file" description="Upload gambar pertama kamu." />
      )}

      {!isLoading && !!media?.length && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {media.map((row) => (
            <div key={row.id} className="group relative overflow-hidden rounded-xl border border-line bg-white">
              <img src={row.url} alt={row.file_name} className="aspect-square w-full object-cover" />
              <div className="absolute inset-0 flex items-end justify-between bg-gradient-to-t from-ink/60 to-transparent p-2 opacity-0 transition group-hover:opacity-100">
                <span className="truncate text-xs text-paper">{row.bucket}</span>
                <div className="flex gap-1">
                  <button onClick={() => copyUrl(row.url)} className="rounded-full bg-white/90 p-1.5 text-ink hover:bg-white" aria-label="Salin URL">
                    <Copy size={13} />
                  </button>
                  <button onClick={() => handleDelete(row)} className="rounded-full bg-white/90 p-1.5 text-red-600 hover:bg-white" aria-label="Hapus">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

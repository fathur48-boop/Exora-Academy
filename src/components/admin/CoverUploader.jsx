import { useState } from "react";
import { Upload, X } from "lucide-react";
import { uploadMedia } from "@/services/media.js";

export default function CoverUploader({ value, onChange }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const media = await uploadMedia("covers", file);
      onChange(media.url);
    } catch (err) {
      setError("Upload gagal. Coba lagi.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      {value ? (
        <div className="relative overflow-hidden rounded-xl border border-line">
          <img src={value} alt="Cover" className="aspect-[16/9] w-full object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-2 top-2 rounded-full bg-ink/70 p-1.5 text-paper hover:bg-ink"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <label className="flex aspect-[16/9] w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-line bg-ink/[0.02] text-muted hover:border-brand hover:text-brand">
          <Upload size={20} />
          <span className="text-sm">{uploading ? "Mengunggah…" : "Upload cover artikel"}</span>
          <input type="file" accept="image/*" className="hidden" onChange={handleFile} disabled={uploading} />
        </label>
      )}
      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  );
}

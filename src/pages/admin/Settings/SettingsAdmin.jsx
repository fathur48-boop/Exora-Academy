import PageHeader from "@/components/admin/PageHeader.jsx";
import { Input } from "@/components/ui/Input.jsx";
import Button from "@/components/ui/Button.jsx";

/**
 * Settings dasar situs. ID Analytics disimpan sebagai environment variable
 * (VITE_GA_ID, VITE_CLARITY_ID) — form ini untuk referensi & dokumentasi tim,
 * bukan menyimpan ke DB (biar tidak perlu redeploy manual tiap ganti ID,
 * hubungkan ke tabel `settings` kalau mau dynamic).
 */
export default function SettingsAdmin() {
  function handleSubmit(e) {
    e.preventDefault();
    alert("Simpan ID ini di file .env.local sebagai VITE_GA_ID / VITE_CLARITY_ID, lalu redeploy.");
  }

  return (
    <>
      <PageHeader title="Settings" description="Pengaturan umum situs & analytics." />

      <form onSubmit={handleSubmit} className="max-w-lg space-y-4 rounded-2xl border border-line bg-white p-5">
        <Input label="Nama Situs" defaultValue="Exora Academy" disabled />
        <Input label="URL Situs" defaultValue={import.meta.env.VITE_SITE_URL || "https://academy.exora.id"} disabled />
        <Input label="Google Analytics ID" placeholder="G-XXXXXXX" defaultValue={import.meta.env.VITE_GA_ID || ""} />
        <Input label="Microsoft Clarity ID" placeholder="xxxxxxx" defaultValue={import.meta.env.VITE_CLARITY_ID || ""} />
        <p className="text-xs text-muted">
          Google Search Console diverifikasi lewat DNS/HTML tag terpisah — lihat panduan GSC.
        </p>
        <Button type="submit">Simpan</Button>
      </form>
    </>
  );
}

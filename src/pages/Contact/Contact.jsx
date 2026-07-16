import { useState } from "react";
import SeoHead from "@/components/seo/SeoHead.jsx";
import { Input, Textarea } from "@/components/ui/Input.jsx";
import Button from "@/components/ui/Button.jsx";

export default function Contact() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    // TODO: hubungkan ke Edge Function / tabel contact_messages saat backend siap.
    setSent(true);
  }

  return (
    <>
      <SeoHead title="Kontak" description="Hubungi tim Exora Academy." path="/contact" />
      <div className="container-page max-w-lg py-14">
        <p className="eyebrow">Kontak</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-ink">Ada pertanyaan?</h1>
        <p className="mt-2 text-muted">Kirim pesan, tim kami akan balas secepatnya.</p>

        {sent ? (
          <p className="mt-8 rounded-2xl border border-line bg-white p-6 text-sm text-ink">
            Pesan kamu terkirim. Terima kasih sudah menghubungi kami!
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <Input label="Nama" required placeholder="Nama kamu" />
            <Input label="Email" type="email" required placeholder="nama@email.com" />
            <Textarea label="Pesan" required rows={5} placeholder="Tulis pesan kamu…" />
            <Button type="submit">Kirim Pesan</Button>
          </form>
        )}
      </div>
    </>
  );
}

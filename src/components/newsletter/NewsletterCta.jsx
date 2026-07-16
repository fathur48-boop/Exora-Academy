import { useState } from "react";

export default function NewsletterCta() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    // TODO: hubungkan ke tabel newsletter_subscribers / Edge Function saat backend siap.
    setSent(true);
  }

  return (
    <section className="rounded-2xl bg-brand px-6 py-10 text-center sm:px-12">
      <p className="eyebrow !text-paper/70">Newsletter</p>
      <h2 className="mt-2 font-display text-2xl font-semibold text-paper sm:text-3xl">
        Tips jualan online & AI, langsung ke email kamu
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-paper/80">
        Sekali seminggu. Tanpa spam, cuma insight yang bisa langsung dipraktikkan.
      </p>
      {sent ? (
        <p className="mt-5 font-medium text-paper">Terima kasih! Cek email kamu untuk konfirmasi.</p>
      ) : (
        <form onSubmit={handleSubmit} className="mx-auto mt-5 flex max-w-sm gap-2">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nama@email.com"
            className="w-full rounded-full border-0 px-4 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-paper"
          />
          <button type="submit" className="whitespace-nowrap rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-paper hover:bg-ink/90">
            Gabung
          </button>
        </form>
      )}
    </section>
  );
}

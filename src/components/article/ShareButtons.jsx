import { Facebook, Twitter, MessageCircle, Link2 } from "lucide-react";
import { useState } from "react";

export default function ShareButtons({ url, title }) {
  const [copied, setCopied] = useState(false);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const links = [
    { icon: Facebook, label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}` },
    { icon: Twitter, label: "Twitter/X", href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}` },
    { icon: MessageCircle, label: "WhatsApp", href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}` },
  ];

  function copyLink() {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-medium text-muted">Bagikan:</span>
      {links.map((l) => (
        <a
          key={l.label}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Bagikan ke ${l.label}`}
          className="rounded-full border border-line p-2 text-ink/70 transition hover:border-brand hover:text-brand"
        >
          <l.icon size={15} />
        </a>
      ))}
      <button
        onClick={copyLink}
        aria-label="Salin tautan"
        className="rounded-full border border-line p-2 text-ink/70 transition hover:border-brand hover:text-brand"
      >
        <Link2 size={15} />
      </button>
      {copied && <span className="text-xs text-brand">Tersalin!</span>}
    </div>
  );
}

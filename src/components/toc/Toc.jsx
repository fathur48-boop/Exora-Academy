import { useEffect, useState } from "react";
import { List } from "lucide-react";

/** items: [{ id, level, text }] — hasil extractToc() */
export default function Toc({ items }) {
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    if (!items?.length) return;
    const headings = items.map((i) => document.getElementById(i.id)).filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: "-100px 0px -70% 0px" }
    );

    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [items]);

  if (!items?.length) return null;

  return (
    <nav className="rounded-2xl border border-line bg-white p-5">
      <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-ink/60">
        <List size={14} /> Daftar Isi
      </p>
      <ul className="space-y-2 text-sm">
        {items.map((item) => (
          <li key={item.id} style={{ paddingLeft: (item.level - 2) * 12 }}>
            <a
              href={`#${item.id}`}
              className={`block truncate transition ${
                activeId === item.id ? "font-medium text-brand" : "text-muted hover:text-ink"
              }`}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

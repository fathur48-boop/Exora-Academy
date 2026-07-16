import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

/** items: [{ label, path }] — path terakhir dianggap halaman aktif (tidak jadi link). */
export default function Breadcrumb({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-xs text-muted">
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={item.path} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight size={12} />}
            {isLast ? (
              <span className="font-medium text-ink">{item.label}</span>
            ) : (
              <Link to={item.path} className="hover:text-brand">
                {item.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}

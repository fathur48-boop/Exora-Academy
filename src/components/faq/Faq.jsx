import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function Faq({ items }) {
  const [openId, setOpenId] = useState(null);

  if (!items?.length) return null;

  return (
    <section aria-labelledby="faq-heading" className="mt-12">
      <h2 id="faq-heading" className="font-display text-xl font-semibold text-ink">
        Pertanyaan Umum
      </h2>
      <div className="mt-4 divide-y divide-line rounded-2xl border border-line bg-white">
        {items.map((item) => {
          const isOpen = openId === item.id;
          return (
            <div key={item.id}>
              <button
                onClick={() => setOpenId(isOpen ? null : item.id)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                aria-expanded={isOpen}
              >
                <span className="font-medium text-ink">{item.question}</span>
                <ChevronDown size={18} className={`shrink-0 text-muted transition ${isOpen ? "rotate-180" : ""}`} />
              </button>
              {isOpen && <p className="px-5 pb-4 text-sm leading-relaxed text-muted">{item.answer}</p>}
            </div>
          );
        })}
      </div>
    </section>
  );
}

const WORDS_PER_MINUTE = 200;

/** Hitung reading time (menit) dari HTML artikel. */
export function calcReadingTime(html = "") {
  const text = html.replace(/<[^>]*>/g, " ");
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
}

/** Auto-generate daftar isi (TOC) dari heading h2/h3 di HTML artikel. */
export function extractToc(html = "") {
  const headingRegex = /<h([23])[^>]*>(.*?)<\/h\1>/gi;
  const toc = [];
  let match;
  while ((match = headingRegex.exec(html)) !== null) {
    const level = Number(match[1]);
    const text = match[2].replace(/<[^>]*>/g, "").trim();
    const id = slugify(text);
    toc.push({ id, level, text });
  }
  return toc;
}

/** Sisipkan id="" ke tiap heading di HTML supaya TOC bisa di-anchor. */
export function injectHeadingIds(html = "") {
  return html.replace(/<h([23])([^>]*)>(.*?)<\/h\1>/gi, (full, level, attrs, inner) => {
    const text = inner.replace(/<[^>]*>/g, "").trim();
    const id = slugify(text);
    if (/id=/.test(attrs)) return full;
    return `<h${level}${attrs} id="${id}">${inner}</h${level}>`;
  });
}

export function slugify(text = "") {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function formatDate(dateStr, locale = "id-ID") {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

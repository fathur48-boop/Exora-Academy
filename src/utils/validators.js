import { z } from "zod";

export const articleSchema = z.object({
  title: z.string().min(5, "Judul minimal 5 karakter"),
  slug: z
    .string()
    .min(3, "Slug minimal 3 karakter")
    .regex(/^[a-z0-9-]+$/, "Slug hanya boleh huruf kecil, angka, dan tanda -"),
  excerpt: z.string().max(300, "Excerpt maksimal 300 karakter").optional().or(z.literal("")),
  content: z.string().min(20, "Isi artikel terlalu pendek"),
  cover_url: z.string().url("URL cover tidak valid").optional().or(z.literal("")),
  category_id: z.string().min(1, "Pilih kategori"),
  author_id: z.string().min(1, "Pilih author"),
  status: z.enum(["draft", "published"]),
  meta_title: z.string().max(70, "Meta title maksimal 70 karakter").optional().or(z.literal("")),
  meta_description: z.string().max(160, "Meta description maksimal 160 karakter").optional().or(z.literal("")),
});

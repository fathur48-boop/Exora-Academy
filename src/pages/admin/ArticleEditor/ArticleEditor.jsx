import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import PageHeader from "@/components/admin/PageHeader.jsx";
import { Input, Textarea, Select } from "@/components/ui/Input.jsx";
import Button from "@/components/ui/Button.jsx";
import TiptapEditor from "@/components/admin/TiptapEditor.jsx";
import CoverUploader from "@/components/admin/CoverUploader.jsx";
import FaqEditor from "@/components/admin/FaqEditor.jsx";
import TagPicker from "@/components/admin/TagPicker.jsx";
import { articleSchema } from "@/utils/validators.js";
import { slugify, calcReadingTime } from "@/utils/content.js";
import { listCategories } from "@/services/categories.js";
import { listAuthors } from "@/services/authors.js";
import { listTags } from "@/services/tags.js";
import { replaceArticleFaqs } from "@/services/faqs.js";
import { createRedirect } from "@/services/redirects.js";
import {
  getArticleById,
  createArticle,
  updateArticle,
  setArticleTags,
} from "@/services/articles.js";

export default function ArticleEditor() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [selectedTagIds, setSelectedTagIds] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [originalSlug, setOriginalSlug] = useState("");
  const [originalCategorySlug, setOriginalCategorySlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(!isEdit);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      cover_url: "",
      category_id: "",
      author_id: "",
      status: "draft",
      meta_title: "",
      meta_description: "",
    },
  });

  const content = watch("content");
  const title = watch("title");
  const coverUrl = watch("cover_url");

  useEffect(() => {
    Promise.all([listCategories(), listAuthors(), listTags()]).then(([cats, auths, tags]) => {
      setCategories(cats);
      setAuthors(auths);
      setAllTags(tags);
    });
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    getArticleById(id).then((article) => {
      reset({
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt || "",
        content: article.content || "",
        cover_url: article.cover_url || "",
        category_id: article.category?.id || "",
        author_id: article.author?.id || "",
        status: article.status,
        meta_title: article.meta_title || "",
        meta_description: article.meta_description || "",
      });
      setFaqs(article.faqs?.map((f) => ({ question: f.question, answer: f.answer })) || []);
      setSelectedTagIds((article.article_tags || []).map((t) => t.tag?.id).filter(Boolean));
      setOriginalSlug(article.slug);
      setOriginalCategorySlug(article.category?.slug || "");
      setSlugTouched(true);
      setLoaded(true);
    });
  }, [id, isEdit, reset]);

  // Auto-generate slug dari judul, selama slug belum diedit manual.
  useEffect(() => {
    if (!slugTouched && title) {
      setValue("slug", slugify(title));
    }
  }, [title, slugTouched, setValue]);

  async function onSubmit(values) {
    setSaving(true);
    try {
      let article;
      if (isEdit) {
        article = await updateArticle(id, values);

        // Redirect manual: kalau slug atau kategori berubah, admin diminta bikin redirect.
        const category = categories.find((c) => c.id === values.category_id);
        const newSlugPath = `/${category?.slug}/${values.slug}`;
        const oldSlugPath = `/${originalCategorySlug}/${originalSlug}`;
        if (oldSlugPath !== newSlugPath && originalSlug) {
          const confirmRedirect = confirm(
            `Slug/kategori berubah dari "${oldSlugPath}" ke "${newSlugPath}".\nBuat redirect 301 otomatis?`
          );
          if (confirmRedirect) {
            await createRedirect({ old_path: oldSlugPath, new_path: newSlugPath, status_code: 301 });
          }
        }
      } else {
        article = await createArticle({
          ...values,
          published_at: values.status === "published" ? new Date().toISOString() : null,
        });
      }

      await setArticleTags(article.id, selectedTagIds);
      await replaceArticleFaqs(article.id, faqs.filter((f) => f.question.trim() && f.answer.trim()));

      navigate("/admin/artikel");
    } catch (err) {
      alert("Gagal menyimpan artikel: " + err.message);
    } finally {
      setSaving(false);
    }
  }

  if (!loaded) return <p className="text-sm text-muted">Memuat artikel…</p>;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <PageHeader
        title={isEdit ? "Edit Artikel" : "Tambah Artikel"}
        description={content ? `${calcReadingTime(content)} menit baca (estimasi)` : undefined}
        action={
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => navigate("/admin/artikel")}>
              Batal
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Menyimpan…" : "Simpan"}
            </Button>
          </div>
        }
      />

      <div className="grid gap-8 lg:grid-cols-[1fr,320px]">
        <div className="space-y-5">
          <Input label="Judul" {...register("title")} error={errors.title?.message} />
          <Input
            label="Slug"
            {...register("slug")}
            onChange={(e) => {
              setSlugTouched(true);
              setValue("slug", e.target.value);
            }}
            error={errors.slug?.message}
          />
          <Textarea label="Excerpt (ringkasan singkat)" rows={2} {...register("excerpt")} error={errors.excerpt?.message} />

          <div>
            <span className="mb-1.5 block text-sm font-medium text-ink">Isi Artikel</span>
            <TiptapEditor value={content} onChange={(html) => setValue("content", html, { shouldValidate: true })} />
            {errors.content && <p className="mt-1.5 text-xs text-red-600">{errors.content.message}</p>}
          </div>

          <div>
            <span className="mb-1.5 block text-sm font-medium text-ink">FAQ</span>
            <FaqEditor faqs={faqs} onChange={setFaqs} />
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-line bg-white p-4">
            <span className="mb-2 block text-sm font-medium text-ink">Cover</span>
            <CoverUploader value={coverUrl} onChange={(url) => setValue("cover_url", url)} />
          </div>

          <div className="space-y-4 rounded-2xl border border-line bg-white p-4">
            <Select label="Status" {...register("status")}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </Select>
            <Select label="Kategori" {...register("category_id")} error={errors.category_id?.message}>
              <option value="">Pilih kategori</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </Select>
            <Select label="Author" {...register("author_id")} error={errors.author_id?.message}>
              <option value="">Pilih author</option>
              {authors.map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </Select>
          </div>

          <div className="rounded-2xl border border-line bg-white p-4">
            <span className="mb-2 block text-sm font-medium text-ink">Tag</span>
            <TagPicker allTags={allTags} selectedIds={selectedTagIds} onChange={setSelectedTagIds} />
          </div>

          <div className="space-y-4 rounded-2xl border border-line bg-white p-4">
            <span className="block text-sm font-semibold text-ink">SEO</span>
            <Input label="Meta Title" {...register("meta_title")} error={errors.meta_title?.message} />
            <Textarea label="Meta Description" rows={3} {...register("meta_description")} error={errors.meta_description?.message} />
          </div>
        </div>
      </div>
    </form>
  );
}

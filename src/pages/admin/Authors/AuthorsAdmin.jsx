import { useState } from "react";
import { Trash2, Plus } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader.jsx";
import DataTable from "@/components/admin/DataTable.jsx";
import { Input, Textarea } from "@/components/ui/Input.jsx";
import Button from "@/components/ui/Button.jsx";
import { useAsync } from "@/hooks/useAsync.js";
import { listAuthors, createAuthor, deleteAuthor } from "@/services/authors.js";
import { slugify } from "@/utils/content.js";

export default function AuthorsAdmin() {
  const { data: authors, isLoading, refetch } = useAsync(() => listAuthors(), []);
  const [form, setForm] = useState({ name: "", bio: "", avatar_url: "" });
  const [saving, setSaving] = useState(false);

  async function handleAdd(e) {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      await createAuthor({ ...form, slug: slugify(form.name) });
      setForm({ name: "", bio: "", avatar_url: "" });
      refetch();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Hapus author ini?")) return;
    await deleteAuthor(id);
    refetch();
  }

  const columns = [
    {
      key: "name",
      header: "Nama",
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <img src={row.avatar_url || "/avatar-placeholder.png"} alt="" className="h-7 w-7 rounded-full object-cover" />
          <span className="font-medium">{row.name}</span>
        </div>
      ),
    },
    { key: "bio", header: "Bio" },
    {
      key: "actions",
      header: "",
      render: (row) => (
        <button onClick={() => handleDelete(row.id)} className="text-ink/60 hover:text-red-600" aria-label="Hapus">
          <Trash2 size={15} />
        </button>
      ),
    },
  ];

  return (
    <>
      <PageHeader title="Author" description="Kelola penulis artikel." />

      <form onSubmit={handleAdd} className="mb-6 grid gap-3 rounded-2xl border border-line bg-white p-4 sm:grid-cols-3">
        <Input label="Nama" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <Input label="URL Avatar" value={form.avatar_url} onChange={(e) => setForm({ ...form, avatar_url: e.target.value })} />
        <Textarea label="Bio singkat" rows={1} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
        <Button type="submit" disabled={saving} className="sm:col-span-3 sm:w-fit">
          <Plus size={15} /> Tambah Author
        </Button>
      </form>

      {!isLoading && <DataTable columns={columns} rows={authors} emptyLabel="Belum ada author." />}
    </>
  );
}

import { useState } from "react";
import { Trash2, Plus } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader.jsx";
import DataTable from "@/components/admin/DataTable.jsx";
import { Input } from "@/components/ui/Input.jsx";
import Button from "@/components/ui/Button.jsx";
import { useAsync } from "@/hooks/useAsync.js";
import { listTags, createTag, deleteTag } from "@/services/tags.js";
import { slugify } from "@/utils/content.js";

export default function TagsAdmin() {
  const { data: tags, isLoading, refetch } = useAsync(() => listTags(), []);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleAdd(e) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      await createTag({ name, slug: slugify(name) });
      setName("");
      refetch();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Hapus tag ini?")) return;
    await deleteTag(id);
    refetch();
  }

  const columns = [
    { key: "name", header: "Nama", render: (row) => <span className="font-medium">#{row.name}</span> },
    { key: "slug", header: "Slug", render: (row) => <span className="font-mono text-xs text-muted">/{row.slug}</span> },
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
      <PageHeader title="Tag" description="Kelola tag artikel." />

      <form onSubmit={handleAdd} className="mb-6 flex items-end gap-3 rounded-2xl border border-line bg-white p-4">
        <div className="flex-1">
          <Input label="Nama Tag" value={name} onChange={(e) => setName(e.target.value)} placeholder="SEO" />
        </div>
        <Button type="submit" disabled={saving} className="shrink-0">
          <Plus size={15} /> Tambah
        </Button>
      </form>

      {!isLoading && <DataTable columns={columns} rows={tags} emptyLabel="Belum ada tag." />}
    </>
  );
}

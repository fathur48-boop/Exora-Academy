import { useState } from "react";
import { Trash2, Plus } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader.jsx";
import DataTable from "@/components/admin/DataTable.jsx";
import { Input, Select } from "@/components/ui/Input.jsx";
import Button from "@/components/ui/Button.jsx";
import { useAsync } from "@/hooks/useAsync.js";
import { listRedirects, createRedirect, deleteRedirect } from "@/services/redirects.js";

export default function RedirectsAdmin() {
  const { data: redirects, isLoading, refetch } = useAsync(() => listRedirects(), []);
  const [form, setForm] = useState({ old_path: "", new_path: "", status_code: "301" });
  const [saving, setSaving] = useState(false);

  async function handleAdd(e) {
    e.preventDefault();
    if (!form.old_path.trim() || !form.new_path.trim()) return;
    setSaving(true);
    try {
      await createRedirect({ ...form, status_code: Number(form.status_code) });
      setForm({ old_path: "", new_path: "", status_code: "301" });
      refetch();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Hapus redirect ini?")) return;
    await deleteRedirect(id);
    refetch();
  }

  const columns = [
    { key: "old_path", header: "Dari", render: (row) => <span className="font-mono text-xs">{row.old_path}</span> },
    { key: "new_path", header: "Ke", render: (row) => <span className="font-mono text-xs">{row.new_path}</span> },
    { key: "status_code", header: "Kode" },
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
      <PageHeader
        title="Redirect"
        description="Redirect diisi manual, biasanya otomatis ditawarkan saat kamu ganti slug artikel di editor."
      />

      <form onSubmit={handleAdd} className="mb-6 grid gap-3 rounded-2xl border border-line bg-white p-4 sm:grid-cols-4">
        <Input label="Path Lama" placeholder="/jualan-online/slug-lama" value={form.old_path} onChange={(e) => setForm({ ...form, old_path: e.target.value })} />
        <Input label="Path Baru" placeholder="/jualan-online/slug-baru" value={form.new_path} onChange={(e) => setForm({ ...form, new_path: e.target.value })} />
        <Select label="Kode Status" value={form.status_code} onChange={(e) => setForm({ ...form, status_code: e.target.value })}>
          <option value="301">301 (Permanent)</option>
          <option value="302">302 (Temporary)</option>
        </Select>
        <Button type="submit" disabled={saving} className="self-end">
          <Plus size={15} /> Tambah
        </Button>
      </form>

      {!isLoading && <DataTable columns={columns} rows={redirects} emptyLabel="Belum ada redirect." />}
    </>
  );
}

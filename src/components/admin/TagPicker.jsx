export default function TagPicker({ allTags, selectedIds, onChange }) {
  function toggle(id) {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((t) => t !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {allTags?.map((tag) => {
        const active = selectedIds.includes(tag.id);
        return (
          <button
            key={tag.id}
            type="button"
            onClick={() => toggle(tag.id)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
              active ? "border-brand bg-brand/10 text-brand-dark" : "border-line text-muted hover:border-ink/30"
            }`}
          >
            #{tag.name}
          </button>
        );
      })}
      {!allTags?.length && <p className="text-sm text-muted">Belum ada tag. Tambah dulu di menu Tag.</p>}
    </div>
  );
}

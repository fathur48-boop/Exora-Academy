/**
 * Tabel generik untuk halaman admin (Artikel, Kategori, Tag, Author, Redirect, dll).
 * columns: [{ key, header, render? }]
 */
export default function DataTable({ columns, rows, emptyLabel = "Belum ada data." }) {
  if (!rows?.length) {
    return <p className="rounded-2xl border border-dashed border-line px-6 py-14 text-center text-sm text-muted">{emptyLabel}</p>;
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-line bg-white">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-line bg-ink/[0.02]">
            {columns.map((col) => (
              <th key={col.key} className="whitespace-nowrap px-4 py-3 font-semibold text-ink/70">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-line last:border-0 hover:bg-ink/[0.015]">
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3 align-middle text-ink">
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

import { Search } from "lucide-react";

export default function SearchBar({ value, onChange, placeholder = "Cari artikel…" }) {
  return (
    <div className="relative">
      <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus
        className="w-full rounded-full border border-line bg-white py-3.5 pl-12 pr-4 text-base focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
      />
    </div>
  );
}

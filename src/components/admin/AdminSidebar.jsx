import { NavLink } from "react-router-dom";
import { LogOut } from "lucide-react";
import { ADMIN_NAV } from "@/constants/admin.js";
import { signOutAdmin } from "@/services/auth.js";

export default function AdminSidebar() {
  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-line bg-white">
      <div className="px-5 py-6">
        <p className="font-display text-lg font-semibold text-ink">
          Exora <span className="text-brand">Academy</span>
        </p>
        <p className="eyebrow mt-0.5">Admin</p>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3">
        {ADMIN_NAV.map(({ label, path, icon: Icon, end }) => (
          <NavLink
            key={path}
            to={path}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                isActive ? "bg-brand/10 text-brand-dark" : "text-ink/70 hover:bg-ink/5 hover:text-ink"
              }`
            }
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-line p-3">
        <button
          onClick={() => signOutAdmin()}
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-ink/70 hover:bg-ink/5 hover:text-ink"
        >
          <LogOut size={17} />
          Keluar
        </button>
      </div>
    </aside>
  );
}

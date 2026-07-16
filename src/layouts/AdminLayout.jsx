import { Outlet } from "react-router-dom";
import AdminSidebar from "@/components/admin/AdminSidebar.jsx";

export default function AdminLayout() {
  return (
    <div className="flex bg-[#F6F5F1]">
      <AdminSidebar />
      <div className="min-h-screen flex-1 overflow-x-hidden">
        <div className="mx-auto max-w-5xl px-6 py-8 lg:px-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

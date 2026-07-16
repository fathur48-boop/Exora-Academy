import {
  LayoutDashboard,
  FileText,
  FilePlus,
  FileClock,
  FolderTree,
  Tag,
  Image,
  Users,
  SearchCheck,
  Route as RouteIcon,
  Map,
  Settings,
} from "lucide-react";

export const ADMIN_NAV = [
  { label: "Dashboard", path: "/admin", icon: LayoutDashboard, end: true },
  { label: "Artikel", path: "/admin/artikel", icon: FileText },
  { label: "Tambah Artikel", path: "/admin/artikel/baru", icon: FilePlus },
  { label: "Draft", path: "/admin/draft", icon: FileClock },
  { label: "Kategori", path: "/admin/kategori", icon: FolderTree },
  { label: "Tag", path: "/admin/tag", icon: Tag },
  { label: "Media", path: "/admin/media", icon: Image },
  { label: "Author", path: "/admin/author", icon: Users },
  { label: "SEO", path: "/admin/seo", icon: SearchCheck },
  { label: "Redirect", path: "/admin/redirect", icon: RouteIcon },
  { label: "Sitemap", path: "/admin/sitemap", icon: Map },
  { label: "Settings", path: "/admin/settings", icon: Settings },
];

export const ARTICLE_STATUS = {
  DRAFT: "draft",
  PUBLISHED: "published",
};

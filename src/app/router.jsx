import { Routes, Route } from "react-router-dom";

import MainLayout from "@/layouts/MainLayout.jsx";
import ArticleLayout from "@/layouts/ArticleLayout.jsx";
import AdminLayout from "@/layouts/AdminLayout.jsx";
import RequireAuth from "@/components/admin/RequireAuth.jsx";

import Home from "@/pages/Home/Home.jsx";
import Category from "@/pages/Category/Category.jsx";
import Article from "@/pages/Article/Article.jsx";
import Search from "@/pages/Search/Search.jsx";
import Tag from "@/pages/Tag/Tag.jsx";
import About from "@/pages/About/About.jsx";
import Contact from "@/pages/Contact/Contact.jsx";
import Privacy from "@/pages/Privacy/Privacy.jsx";
import Terms from "@/pages/Terms/Terms.jsx";
import NotFound from "@/pages/NotFound/NotFound.jsx";

import Login from "@/pages/admin/Login/Login.jsx";
import Dashboard from "@/pages/admin/Dashboard/Dashboard.jsx";
import ArticlesList from "@/pages/admin/Articles/ArticlesList.jsx";
import DraftsList from "@/pages/admin/Articles/DraftsList.jsx";
import ArticleEditor from "@/pages/admin/ArticleEditor/ArticleEditor.jsx";
import CategoriesAdmin from "@/pages/admin/Categories/CategoriesAdmin.jsx";
import TagsAdmin from "@/pages/admin/Tags/TagsAdmin.jsx";
import MediaAdmin from "@/pages/admin/Media/MediaAdmin.jsx";
import AuthorsAdmin from "@/pages/admin/Authors/AuthorsAdmin.jsx";
import SeoAdmin from "@/pages/admin/Seo/SeoAdmin.jsx";
import RedirectsAdmin from "@/pages/admin/Redirects/RedirectsAdmin.jsx";
import SitemapAdmin from "@/pages/admin/Sitemap/SitemapAdmin.jsx";
import SettingsAdmin from "@/pages/admin/Settings/SettingsAdmin.jsx";

export default function AppRouter() {
  return (
    <Routes>
      {/* Public site */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/kategori" element={<Category />} />
        <Route path="/kategori/:slug" element={<Category />} />
        <Route path="/tag/:slug" element={<Tag />} />
        <Route path="/search" element={<Search />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
      </Route>

      {/* Article pages: /:kategori/:slug — own layout (TOC, reading progress) */}
      <Route element={<ArticleLayout />}>
        <Route path="/:kategori/:slug" element={<Article />} />
      </Route>

      {/* Admin auth */}
      <Route path="/admin/login" element={<Login />} />

      {/* Admin CMS (protected) */}
      <Route
        path="/admin"
        element={
          <RequireAuth>
            <AdminLayout />
          </RequireAuth>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="artikel" element={<ArticlesList />} />
        <Route path="artikel/baru" element={<ArticleEditor />} />
        <Route path="artikel/:id" element={<ArticleEditor />} />
        <Route path="draft" element={<DraftsList />} />
        <Route path="kategori" element={<CategoriesAdmin />} />
        <Route path="tag" element={<TagsAdmin />} />
        <Route path="media" element={<MediaAdmin />} />
        <Route path="author" element={<AuthorsAdmin />} />
        <Route path="seo" element={<SeoAdmin />} />
        <Route path="redirect" element={<RedirectsAdmin />} />
        <Route path="sitemap" element={<SitemapAdmin />} />
        <Route path="settings" element={<SettingsAdmin />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

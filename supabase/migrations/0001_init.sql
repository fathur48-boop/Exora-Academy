-- Exora Academy — Supabase schema
-- Jalankan di SQL Editor Supabase, urut dari atas ke bawah.

-- ========== EXTENSIONS ==========
create extension if not exists "uuid-ossp";
create extension if not exists pg_trgm;

-- ========== PROFILES (admin, role tunggal) ==========
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'admin' check (role = 'admin'),
  created_at timestamptz not null default now()
);

-- ========== AUTHORS ==========
create table authors (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  bio text,
  avatar_url text,
  created_at timestamptz not null default now()
);

-- ========== CATEGORIES ==========
create table categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ========== TAGS ==========
create table tags (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);

-- ========== ARTICLES ==========
create table articles (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text not null default '',
  cover_url text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  meta_title text,
  meta_description text,
  category_id uuid references categories(id) on delete set null,
  author_id uuid references authors(id) on delete set null,
  views bigint not null default 0,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  fts tsvector generated always as (
    to_tsvector('indonesian', coalesce(title, '') || ' ' || coalesce(excerpt, '') || ' ' || coalesce(content, ''))
  ) stored
);

create index articles_fts_idx on articles using gin (fts);
create index articles_category_idx on articles (category_id);
create index articles_status_idx on articles (status);

-- ========== ARTICLE_TAGS (many-to-many) ==========
create table article_tags (
  article_id uuid not null references articles(id) on delete cascade,
  tag_id uuid not null references tags(id) on delete cascade,
  primary key (article_id, tag_id)
);

-- ========== FAQS (per artikel) ==========
create table faqs (
  id uuid primary key default uuid_generate_v4(),
  article_id uuid not null references articles(id) on delete cascade,
  question text not null,
  answer text not null,
  sort_order int not null default 0
);

-- ========== ARTICLE_VIEWS (log per view, opsional dipakai buat analytics lanjutan) ==========
create table article_views (
  id uuid primary key default uuid_generate_v4(),
  article_id uuid not null references articles(id) on delete cascade,
  viewed_at timestamptz not null default now()
);

-- ========== REDIRECTS (diisi manual admin) ==========
create table redirects (
  id uuid primary key default uuid_generate_v4(),
  old_path text not null unique,
  new_path text not null,
  status_code int not null default 301,
  created_at timestamptz not null default now()
);

-- ========== MEDIA ==========
create table media (
  id uuid primary key default uuid_generate_v4(),
  bucket text not null,
  path text not null,
  url text not null,
  file_name text,
  mime_type text,
  size_bytes bigint,
  created_at timestamptz not null default now()
);

-- ========== FUNCTION: increment_article_views ==========
create or replace function increment_article_views(p_article_id uuid)
returns void as $$
begin
  update articles set views = views + 1 where id = p_article_id;
  insert into article_views (article_id) values (p_article_id);
end;
$$ language plpgsql security definer;

-- ========== updated_at auto-touch ==========
create or replace function touch_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger articles_touch_updated_at before update on articles
  for each row execute function touch_updated_at();
create trigger categories_touch_updated_at before update on categories
  for each row execute function touch_updated_at();

-- ========== ROW LEVEL SECURITY ==========
alter table profiles enable row level security;
alter table authors enable row level security;
alter table categories enable row level security;
alter table tags enable row level security;
alter table articles enable row level security;
alter table article_tags enable row level security;
alter table faqs enable row level security;
alter table article_views enable row level security;
alter table redirects enable row level security;
alter table media enable row level security;

-- Publik: boleh baca artikel published + semua master data (kategori, tag, author, faq artikel published)
create policy "public read published articles" on articles
  for select using (status = 'published');
create policy "public read categories" on categories for select using (true);
create policy "public read tags" on tags for select using (true);
create policy "public read authors" on authors for select using (true);
create policy "public read article_tags" on article_tags for select using (true);
create policy "public read faqs" on faqs for select using (true);
create policy "public insert article_views" on article_views for insert with check (true);

-- Admin (authenticated, role admin di profiles): full akses ke semua tabel manajemen konten
create policy "admin full access articles" on articles for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin full access categories" on categories for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin full access tags" on tags for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin full access authors" on authors for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin full access article_tags" on article_tags for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin full access faqs" on faqs for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin full access redirects" on redirects for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin full access media" on media for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin read profiles" on profiles for select
  using (auth.uid() = id);

-- Redirects perlu bisa dibaca publik juga (dicek di ArticleLayout saat 404)
create policy "public read redirects" on redirects for select using (true);

-- ========== STORAGE BUCKETS ==========
insert into storage.buckets (id, name, public) values
  ('covers', 'covers', true),
  ('content', 'content', true),
  ('authors', 'authors', true),
  ('logos', 'logos', true),
  ('icons', 'icons', true),
  ('uploads', 'uploads', true)
on conflict (id) do nothing;

create policy "public read all buckets" on storage.objects for select using (true);
create policy "admin upload all buckets" on storage.objects for insert
  with check (auth.role() = 'authenticated');
create policy "admin delete all buckets" on storage.objects for delete
  using (auth.role() = 'authenticated');

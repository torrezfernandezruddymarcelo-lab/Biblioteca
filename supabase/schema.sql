-- Biblioteca Galáctica: esquema inicial para Supabase.
-- Ejecutar en Supabase > SQL Editor. Las contraseñas NUNCA se guardan aquí:
-- Supabase Auth administra las credenciales.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  carnet text not null unique,
  role text not null default 'USUARIO'
    check (role in ('ADMIN_PRINCIPAL','ADMIN','DOCENTE','USUARIO')),
  created_at timestamptz not null default now()
);

create table if not exists public.books (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  author text not null,
  category text not null,
  year integer not null,
  description text not null default '',
  pdf_url text,
  status text not null default 'Disponible'
    check (status in ('Disponible','Prestado')),
  created_at timestamptz not null default now()
);

create table if not exists public.book_requests (
  id uuid primary key default gen_random_uuid(),
  book_id uuid not null references public.books(id),
  user_id uuid not null references public.profiles(id),
  status text not null default 'Solicitado'
    check (status in ('Solicitado','Aprobado','Rechazado','Devuelto')),
  requested_at timestamptz not null default now()
);

create table if not exists public.teacher_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id),
  status text not null default 'Pendiente'
    check (status in ('Pendiente','Aprobada','Rechazada')),
  requested_at timestamptz not null default now(),
  reviewed_at timestamptz,
  unique (user_id)
);

create index if not exists book_requests_user_id_idx on public.book_requests(user_id);
create index if not exists book_requests_book_id_idx on public.book_requests(book_id);
create index if not exists teacher_requests_status_idx on public.teacher_requests(status);

create or replace function public.current_user_role()
returns text language sql stable security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid()
$$;

alter table public.profiles enable row level security;
alter table public.books enable row level security;
alter table public.book_requests enable row level security;
alter table public.teacher_requests enable row level security;

drop policy if exists "profiles_read_self_or_admin" on public.profiles;
create policy "profiles_read_self_or_admin" on public.profiles
for select to authenticated
using (id = auth.uid() or public.current_user_role() in ('ADMIN','ADMIN_PRINCIPAL'));

drop policy if exists "profiles_update_admin" on public.profiles;
create policy "profiles_update_admin" on public.profiles
for update to authenticated
using (public.current_user_role() in ('ADMIN','ADMIN_PRINCIPAL'))
with check (public.current_user_role() in ('ADMIN','ADMIN_PRINCIPAL'));

drop policy if exists "books_read_authenticated" on public.books;
create policy "books_read_authenticated" on public.books
for select to authenticated using (true);

drop policy if exists "books_admin_write" on public.books;
create policy "books_admin_write" on public.books
for all to authenticated
using (public.current_user_role() in ('ADMIN','ADMIN_PRINCIPAL'))
with check (public.current_user_role() in ('ADMIN','ADMIN_PRINCIPAL'));

drop policy if exists "requests_read_owner_or_admin" on public.book_requests;
create policy "requests_read_owner_or_admin" on public.book_requests
for select to authenticated
using (user_id = auth.uid() or public.current_user_role() in ('ADMIN','ADMIN_PRINCIPAL'));

drop policy if exists "requests_create_self" on public.book_requests;
create policy "requests_create_self" on public.book_requests
for insert to authenticated with check (user_id = auth.uid() and status = 'Solicitado');

drop policy if exists "requests_admin_update" on public.book_requests;
create policy "requests_admin_update" on public.book_requests
for update to authenticated
using (public.current_user_role() in ('ADMIN','ADMIN_PRINCIPAL'))
with check (public.current_user_role() in ('ADMIN','ADMIN_PRINCIPAL'));

drop policy if exists "teacher_requests_read_owner_or_admin" on public.teacher_requests;
create policy "teacher_requests_read_owner_or_admin" on public.teacher_requests
for select to authenticated
using (user_id = auth.uid() or public.current_user_role() = 'ADMIN_PRINCIPAL');

drop policy if exists "teacher_requests_create_self" on public.teacher_requests;
create policy "teacher_requests_create_self" on public.teacher_requests
for insert to authenticated with check (user_id = auth.uid() and status = 'Pendiente');

drop policy if exists "teacher_requests_admin_review" on public.teacher_requests;
create policy "teacher_requests_admin_review" on public.teacher_requests
for update to authenticated
using (public.current_user_role() = 'ADMIN_PRINCIPAL')
with check (public.current_user_role() = 'ADMIN_PRINCIPAL');

-- Importante: no se permite al usuario cambiar su propio rol.
-- El primer ADMIN_PRINCIPAL se asigna manualmente desde el panel SQL
-- después de crear su cuenta y conocer su UUID.

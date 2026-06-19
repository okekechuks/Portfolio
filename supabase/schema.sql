-- Run this in Supabase SQL Editor (Dashboard → SQL → New query)

create table if not exists skills (
  id text primary key,
  name text not null,
  category text not null,
  enabled boolean not null default false,
  learning boolean not null default false,
  proficiency text not null default 'Intermediate'
);

create table if not exists projects (
  id text primary key,
  title text not null,
  description text not null default '',
  image text not null default '',
  github_url text not null default '',
  live_url text not null default '',
  tech_stack jsonb not null default '[]',
  featured boolean not null default false,
  enabled boolean not null default true,
  sort_order integer not null default 0
);

create table if not exists experience (
  id text primary key,
  company text not null,
  role text not null,
  duration text not null default '',
  description text not null default '',
  technologies jsonb not null default '[]',
  enabled boolean not null default true,
  sort_order integer not null default 0
);

create table if not exists socials (
  id text primary key,
  platform text not null,
  label text not null,
  url text not null default '',
  enabled boolean not null default true
);

create table if not exists site_settings (
  id text primary key default 'site',
  name text not null,
  title text not null,
  introduction text not null default '',
  profile_image text not null default '',
  resume_url text not null default '',
  accent_color text not null default '#3b82f6',
  dark_mode boolean not null default true,
  admin_password text not null,
  admin_phone text not null default ''
);

alter table skills enable row level security;
alter table projects enable row level security;
alter table experience enable row level security;
alter table socials enable row level security;
alter table site_settings enable row level security;

-- Public read policies (API uses service role; these protect direct client access)
create policy "Public read enabled skills" on skills for select using (enabled = true);
create policy "Public read enabled projects" on projects for select using (enabled = true);
create policy "Public read enabled experience" on experience for select using (enabled = true);
create policy "Public read enabled socials" on socials for select using (enabled = true);
create policy "Public read settings" on site_settings for select using (true);

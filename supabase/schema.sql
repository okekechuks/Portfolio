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
drop policy if exists "Public read enabled skills" on skills;
drop policy if exists "Public read enabled projects" on projects;
drop policy if exists "Public read enabled experience" on experience;
drop policy if exists "Public read enabled socials" on socials;
drop policy if exists "Public read settings" on site_settings;

create policy "Public read enabled skills" on skills for select using (enabled = true);
create policy "Public read enabled projects" on projects for select using (enabled = true);
create policy "Public read enabled experience" on experience for select using (enabled = true);
create policy "Public read enabled socials" on socials for select using (enabled = true);
create policy "Public read settings" on site_settings for select using (true);

insert into skills (id, name, category, enabled, learning, proficiency) values
  ('languages-csharp', 'C#', 'Languages', true, false, 'Advanced'),
  ('languages-typescript', 'TypeScript', 'Languages', true, false, 'Advanced'),
  ('languages-javascript', 'JavaScript', 'Languages', true, false, 'Advanced'),
  ('languages-python', 'Python', 'Languages', true, false, 'Advanced'),
  ('languages-sql', 'SQL', 'Languages', true, false, 'Advanced'),
  ('languages-java', 'Java', 'Languages', false, false, 'Advanced'),
  ('languages-go', 'Go', 'Languages', false, false, 'Advanced'),
  ('languages-rust', 'Rust', 'Languages', false, false, 'Advanced'),
  ('languages-php', 'PHP', 'Languages', false, false, 'Advanced'),
  ('languages-ruby', 'Ruby', 'Languages', false, false, 'Advanced'),
  ('languages-kotlin', 'Kotlin', 'Languages', false, false, 'Advanced'),
  ('languages-swift', 'Swift', 'Languages', false, false, 'Advanced'),
  ('languages-dart', 'Dart', 'Languages', false, false, 'Advanced'),
  ('languages-c', 'C', 'Languages', false, false, 'Advanced'),
  ('languages-cplusplus', 'C++', 'Languages', false, false, 'Advanced'),
  ('frontend-react', 'React', 'Frontend', true, false, 'Advanced'),
  ('frontend-next-js', 'Next.js', 'Frontend', true, false, 'Advanced'),
  ('frontend-angular', 'Angular', 'Frontend', true, true, 'Beginner'),
  ('frontend-vue', 'Vue', 'Frontend', false, false, 'Advanced'),
  ('frontend-svelte', 'Svelte', 'Frontend', false, false, 'Advanced'),
  ('frontend-tailwind-css', 'Tailwind CSS', 'Frontend', true, false, 'Advanced'),
  ('frontend-html5', 'HTML5', 'Frontend', false, false, 'Advanced'),
  ('frontend-css3', 'CSS3', 'Frontend', false, false, 'Advanced'),
  ('frontend-bootstrap', 'Bootstrap', 'Frontend', false, false, 'Advanced'),
  ('backend-net', '.NET', 'Backend', true, false, 'Advanced'),
  ('backend-asp-net-core', 'ASP.NET Core', 'Backend', true, false, 'Advanced'),
  ('backend-node-js', 'Node.js', 'Backend', true, false, 'Advanced'),
  ('backend-express', 'Express', 'Backend', false, false, 'Advanced'),
  ('backend-django', 'Django', 'Backend', false, false, 'Advanced'),
  ('backend-flask', 'Flask', 'Backend', false, false, 'Advanced'),
  ('backend-spring-boot', 'Spring Boot', 'Backend', false, false, 'Advanced'),
  ('backend-laravel', 'Laravel', 'Backend', false, false, 'Advanced'),
  ('databases-sql-server', 'SQL Server', 'Databases', true, false, 'Advanced'),
  ('databases-postgresql', 'PostgreSQL', 'Databases', true, false, 'Advanced'),
  ('databases-mysql', 'MySQL', 'Databases', false, false, 'Advanced'),
  ('databases-sqlite', 'SQLite', 'Databases', false, false, 'Advanced'),
  ('databases-mongodb', 'MongoDB', 'Databases', true, false, 'Advanced'),
  ('databases-redis', 'Redis', 'Databases', false, false, 'Advanced'),
  ('tools-git', 'Git', 'Tools', true, false, 'Advanced'),
  ('tools-github', 'GitHub', 'Tools', true, false, 'Advanced'),
  ('tools-docker', 'Docker', 'Tools', true, false, 'Advanced'),
  ('tools-postman', 'Postman', 'Tools', false, false, 'Advanced'),
  ('tools-linux', 'Linux', 'Tools', false, false, 'Advanced'),
  ('tools-bash', 'Bash', 'Tools', false, false, 'Advanced'),
  ('tools-vite', 'Vite', 'Tools', false, false, 'Advanced'),
  ('tools-vs-code', 'VS Code', 'Tools', true, false, 'Advanced'),
  ('tools-azure', 'Azure', 'Tools', true, false, 'Advanced'),
  ('tools-aws', 'AWS', 'Tools', false, false, 'Advanced'),
  ('tools-firebase', 'Firebase', 'Tools', false, false, 'Advanced')
on conflict (id) do nothing;

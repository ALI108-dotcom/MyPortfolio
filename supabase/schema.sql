-- =========================================================================
-- SUPABASE DATABASE SCHEMA FOR SHAIK ALI AHAMMAD PORTFOLIO
-- =========================================================================
-- This script sets up the complete database schema in Supabase.
-- It is 100% safe to re-run multiple times (idempotent).
-- =========================================================================

-- 1. EXTENSIONS
create extension if not exists "uuid-ossp";

-- =========================================================================
-- 2. MAIN APPLICATION CONTENT TABLE (Unified JSONB Document)
-- This powers the live Vercel Serverless API (/api/content) with atomic,
-- instantaneous sync between Laptop and Mobile CMS editing.
-- =========================================================================
create table if not exists public.portfolio_content (
  id text primary key default 'main',
  content jsonb not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.portfolio_content enable row level security;

-- Drop existing policies first (prevents "policy already exists" error)
drop policy if exists "Allow public read for portfolio_content" on public.portfolio_content;
drop policy if exists "Allow update/insert for portfolio_content" on public.portfolio_content;

-- Read policy: Anyone can read portfolio content
create policy "Allow public read for portfolio_content"
  on public.portfolio_content for select
  using (true);

-- Write policy: Allow authenticated and anon (via API) to insert/update
create policy "Allow update/insert for portfolio_content"
  on public.portfolio_content for all
  using (true)
  with check (true);

-- =========================================================================
-- 3. NORMALIZED RELATIONAL TABLES (For Supabase Table Editor inspection)
-- =========================================================================

-- Table: Profile
create table if not exists public.profiles (
  id text primary key default 'main',
  name text not null default 'Shaik Ali Ahammad',
  role_title text default 'What I Know & What I Did',
  degree_short text default 'B.Tech AI & Data Science',
  degree_full text default 'B.Tech in Artificial Intelligence and Data Science',
  institution text default '',
  location text default '',
  graduation_batch text default '2028',
  career_goal text default 'Continuously learn, build impactful projects, and master modern technologies.',
  target_role text default 'Technology Learner & Builder',
  bio_headline text default 'What I Know Till Now & What I Have Built',
  bio_summary text default 'Welcome to my portfolio! Here I document everything I know, the projects I have built, and the skills I am continuously learning.',
  about_paragraph text default 'I am a student passionate about technology, programming, and building real-world projects.',
  github_username text default 'ALI108-dotcom',
  github_url text default 'https://github.com/ALI108-dotcom',
  email_configurable text default 'SHAIKALIBHAI9895@GMAIL.COM',
  linkedin_configurable text default 'https://www.linkedin.com/in/shaik-ali-ahammad-b6b38b321/',
  intro_video_url text default 'https://www.youtube.com/watch?v=xC-c7E5PK0Y',
  intro_video_title text default 'Introduction & Technical Learning Journey',
  intro_video_duration text default '3 min',
  photo_url text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.profiles enable row level security;
drop policy if exists "Public read profiles" on public.profiles;
drop policy if exists "Public write profiles" on public.profiles;
create policy "Public read profiles" on public.profiles for select using (true);
create policy "Public write profiles" on public.profiles for all using (true) with check (true);

-- Table: Skills
create table if not exists public.skills (
  id text primary key,
  name text not null,
  category text default 'core',
  description text,
  tags text[] default '{}',
  gradient_class text default 'grad-verdant',
  icon_name text default 'Code',
  proficiency text default 'Practical',
  supporting_project text,
  published boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.skills enable row level security;
drop policy if exists "Public read skills" on public.skills;
drop policy if exists "Public write skills" on public.skills;
create policy "Public read skills" on public.skills for select using (true);
create policy "Public write skills" on public.skills for all using (true) with check (true);

-- Table: Projects
create table if not exists public.projects (
  id text primary key,
  title text not null,
  tagline text,
  problem_statement text,
  description text,
  technologies text[] default '{}',
  category text default 'Python & EDA',
  featured boolean default false,
  repo_url text,
  demo_url text,
  dataset_or_source text,
  completion_date text,
  highlight_badge text,
  published boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.projects enable row level security;
drop policy if exists "Public read projects" on public.projects;
drop policy if exists "Public write projects" on public.projects;
create policy "Public read projects" on public.projects for select using (true);
create policy "Public write projects" on public.projects for all using (true) with check (true);

-- Table: Focus Tracks
create table if not exists public.focus_tracks (
  id text primary key,
  track_label text not null,
  title text not null,
  description text,
  icon_name text default 'Terminal',
  color_variant text default 'azure',
  published boolean default true
);
alter table public.focus_tracks enable row level security;
drop policy if exists "Public read focus_tracks" on public.focus_tracks;
drop policy if exists "Public write focus_tracks" on public.focus_tracks;
create policy "Public read focus_tracks" on public.focus_tracks for select using (true);
create policy "Public write focus_tracks" on public.focus_tracks for all using (true) with check (true);

-- Table: About Pillars
create table if not exists public.about_pillars (
  id text primary key,
  num text not null,
  title text not null,
  desc_text text not null,
  border_class text default 'border-azure hover:border-foreground',
  published boolean default true
);
alter table public.about_pillars enable row level security;
drop policy if exists "Public read about_pillars" on public.about_pillars;
drop policy if exists "Public write about_pillars" on public.about_pillars;
create policy "Public read about_pillars" on public.about_pillars for select using (true);
create policy "Public write about_pillars" on public.about_pillars for all using (true) with check (true);

-- Table: Stats Bar Highlights
create table if not exists public.stats_bar (
  id text primary key,
  label text not null,
  value text not null,
  color_class text default 'text-azure'
);
alter table public.stats_bar enable row level security;
drop policy if exists "Public read stats_bar" on public.stats_bar;
drop policy if exists "Public write stats_bar" on public.stats_bar;
create policy "Public read stats_bar" on public.stats_bar for select using (true);
create policy "Public write stats_bar" on public.stats_bar for all using (true) with check (true);

-- Table: Certifications
create table if not exists public.certifications (
  id text primary key,
  name text not null,
  issuing_org text,
  issue_date text,
  credential_id text,
  verification_url text,
  description text,
  skills text[] default '{}',
  published boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.certifications enable row level security;
drop policy if exists "Public read certifications" on public.certifications;
drop policy if exists "Public write certifications" on public.certifications;
create policy "Public read certifications" on public.certifications for select using (true);
create policy "Public write certifications" on public.certifications for all using (true) with check (true);

-- Table: Learning Journey
create table if not exists public.learning_journey (
  id text primary key,
  title text not null,
  category text,
  summary text,
  key_concepts text[] default '{}',
  practical_application text,
  related_technologies text[] default '{}',
  related_project_url text,
  date_learned text,
  published boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.learning_journey enable row level security;
drop policy if exists "Public read learning_journey" on public.learning_journey;
drop policy if exists "Public write learning_journey" on public.learning_journey;
create policy "Public read learning_journey" on public.learning_journey for select using (true);
create policy "Public write learning_journey" on public.learning_journey for all using (true) with check (true);

-- Table: Experience
create table if not exists public.experience (
  id text primary key,
  role text not null,
  organization text not null,
  location text,
  period text,
  status text,
  summary text,
  tasks_completed text[] default '{}',
  skills_practiced text[] default '{}',
  verification_url text,
  certificate_note text,
  published boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.experience enable row level security;
drop policy if exists "Public read experience" on public.experience;
drop policy if exists "Public write experience" on public.experience;
create policy "Public read experience" on public.experience for select using (true);
create policy "Public write experience" on public.experience for all using (true) with check (true);

-- Table: Education
create table if not exists public.education (
  id text primary key default 'primary_edu',
  degree text not null,
  specialization text not null,
  institution text default '',
  location text default '',
  batch text default '2028',
  status text default 'Pursuing',
  key_coursework text[] default '{}'
);
alter table public.education enable row level security;
drop policy if exists "Public read education" on public.education;
drop policy if exists "Public write education" on public.education;
create policy "Public read education" on public.education for select using (true);
create policy "Public write education" on public.education for all using (true) with check (true);

-- Table: Education Milestones
create table if not exists public.education_milestones (
  id text primary key,
  num text,
  title text not null,
  subtitle text not null,
  period text not null,
  published boolean default true
);
alter table public.education_milestones enable row level security;
drop policy if exists "Public read education_milestones" on public.education_milestones;
drop policy if exists "Public write education_milestones" on public.education_milestones;
create policy "Public read education_milestones" on public.education_milestones for select using (true);
create policy "Public write education_milestones" on public.education_milestones for all using (true) with check (true);

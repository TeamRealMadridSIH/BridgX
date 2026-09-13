-- SolveHub social application schema
-- Run this file once in Supabase Dashboard > SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  name text not null default 'New member',
  role text not null default 'citizen' check (role in ('citizen', 'solver', 'mentor', 'organization', 'university', 'industry')),
  avatar_url text,
  bio text default '',
  location text,
  website text,
  github_username text,
  followers_count integer not null default 0,
  following_count integer not null default 0,
  posts_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.follows (
  follower_id uuid not null references public.profiles(id) on delete cascade,
  following_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (follower_id, following_id),
  check (follower_id <> following_id)
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 5000),
  image_url text,
  visibility text not null default 'public' check (visibility in ('public', 'followers')),
  likes_count integer not null default 0,
  comments_count integer not null default 0,
  saves_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.post_likes (
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

create table if not exists public.saved_posts (
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  parent_id uuid references public.comments(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 2000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  title text,
  is_group boolean not null default false,
  created_by uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.conversation_members (
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  last_read_at timestamptz,
  joined_at timestamptz not null default now(),
  primary key (conversation_id, user_id)
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 5000),
  attachment_url text,
  created_at timestamptz not null default now(),
  edited_at timestamptz
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  actor_id uuid references public.profiles(id) on delete set null,
  type text not null check (type in ('follow', 'like', 'comment', 'message', 'challenge', 'workspace')),
  entity_id uuid,
  text text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.challenges (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text not null,
  category text,
  deadline timestamptz,
  prize text,
  status text not null default 'open' check (status in ('open', 'in_progress', 'completed')),
  created_at timestamptz not null default now()
);

create table if not exists public.challenge_applications (
  id uuid primary key default gen_random_uuid(),
  challenge_id uuid not null references public.challenges(id) on delete cascade,
  applicant_id uuid not null references public.profiles(id) on delete cascade,
  proposal text not null,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'rejected')),
  created_at timestamptz not null default now(),
  unique (challenge_id, applicant_id)
);

create table if not exists public.workspaces (
  id uuid primary key default gen_random_uuid(),
  challenge_id uuid references public.challenges(id) on delete set null,
  title text not null,
  github_repo text,
  created_by uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.workspace_members (
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (workspace_id, user_id)
);

create index if not exists posts_created_at_idx on public.posts (created_at desc);
create index if not exists posts_author_id_idx on public.posts (author_id);
create index if not exists comments_post_id_idx on public.comments (post_id, created_at);
create index if not exists messages_conversation_id_idx on public.messages (conversation_id, created_at);
create index if not exists notifications_user_id_idx on public.notifications (user_id, created_at desc);

alter table public.profiles enable row level security;
alter table public.follows enable row level security;
alter table public.posts enable row level security;
alter table public.post_likes enable row level security;
alter table public.saved_posts enable row level security;
alter table public.comments enable row level security;
alter table public.conversations enable row level security;
alter table public.conversation_members enable row level security;
alter table public.messages enable row level security;
alter table public.notifications enable row level security;
alter table public.challenges enable row level security;
alter table public.challenge_applications enable row level security;
alter table public.workspaces enable row level security;
alter table public.workspace_members enable row level security;

-- The Node server uses the server-only secret key and therefore bypasses RLS.
-- These policies allow safe client-side reads while keeping writes behind the API.
create policy "public profiles are readable" on public.profiles for select using (true);
create policy "public posts are readable" on public.posts for select using (visibility = 'public' or auth.uid() = author_id);
create policy "public comments are readable" on public.comments for select using (true);
create policy "public challenges are readable" on public.challenges for select using (true);

-- Backfill every existing Supabase Auth account, including the demo account.
insert into public.profiles (id, name, role)
select id,
       coalesce(raw_user_meta_data ->> 'name', split_part(email, '@', 1)),
       coalesce(raw_user_meta_data ->> 'role', 'citizen')
from auth.users
on conflict (id) do nothing;

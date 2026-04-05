-- Enable UUID extension
create extension if not exists "pgcrypto";

-- PEOPLE
create table people (
  id                    uuid primary key default gen_random_uuid(),
  full_name             text not null,
  birth_date            date,
  death_date            date,
  bio                   text,
  gender                text check (gender in ('male','female','other')),
  photo_url             text,
  cloudinary_public_id  text,
  created_by            uuid not null references auth.users(id) on delete cascade,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),
  constraint death_after_birth check (
    death_date is null or birth_date is null or death_date >= birth_date
  )
);

-- FAMILY TREES
create table family_trees (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  owner_id    uuid not null references auth.users(id) on delete cascade,
  is_public   boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (owner_id, name)
);

-- TREE MEMBERS
create table tree_members (
  id         uuid primary key default gen_random_uuid(),
  tree_id    uuid not null references family_trees(id) on delete cascade,
  person_id  uuid not null references people(id) on delete cascade,
  added_at   timestamptz not null default now(),
  unique (tree_id, person_id)
);

-- RELATIONSHIPS
create type relationship_type as enum (
  'parent_child', 'spouse', 'sibling', 'extramarital'
);

create table relationships (
  id                uuid primary key default gen_random_uuid(),
  tree_id           uuid not null references family_trees(id) on delete cascade,
  person_a_id       uuid not null references people(id) on delete cascade,
  person_b_id       uuid not null references people(id) on delete cascade,
  relationship_type relationship_type not null,
  is_biological     boolean not null default true,
  married_on        date,
  divorced_on       date,
  created_by        uuid not null references auth.users(id) on delete cascade,
  created_at        timestamptz not null default now(),
  constraint no_self_relationship check (person_a_id <> person_b_id),
  unique (tree_id, person_a_id, person_b_id, relationship_type),
  constraint divorce_after_marriage check (
    divorced_on is null or married_on is null or divorced_on >= married_on
  )
);

-- TREE CONTRIBUTORS
create type contributor_role as enum ('owner', 'editor', 'viewer');

create table tree_contributors (
  id                    uuid primary key default gen_random_uuid(),
  tree_id               uuid not null references family_trees(id) on delete cascade,
  user_id               uuid not null references auth.users(id) on delete cascade,
  role                  contributor_role not null,
  branch_root_person_id uuid references people(id) on delete set null,
  invited_at            timestamptz not null default now(),
  unique (tree_id, user_id)
);

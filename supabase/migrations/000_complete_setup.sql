-- =============================================
-- FAMILY TREE — COMPLETE DATABASE SETUP
-- Copy this entire file into Supabase SQL Editor and click Run
-- =============================================

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
  gotra                 text,
  nakshatra             text,
  rashi                 text,
  native_village        text,
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

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

alter table family_trees enable row level security;
create policy "owner full access" on family_trees for all using (owner_id = auth.uid());
create policy "public read" on family_trees for select using (is_public = true);
create policy "contributor read" on family_trees for select using (exists (select 1 from tree_contributors tc where tc.tree_id = family_trees.id and tc.user_id = auth.uid()));

alter table people enable row level security;
create policy "creator access" on people for all using (created_by = auth.uid());
create policy "contributor write" on people for all using (exists (select 1 from tree_members tm join tree_contributors tc on tc.tree_id = tm.tree_id where tm.person_id = people.id and tc.user_id = auth.uid() and tc.role in ('owner','editor')));
create policy "viewer read" on people for select using (exists (select 1 from tree_members tm join family_trees ft on ft.id = tm.tree_id left join tree_contributors tc on tc.tree_id = tm.tree_id and tc.user_id = auth.uid() where tm.person_id = people.id and (ft.is_public = true or tc.user_id is not null)));

alter table relationships enable row level security;
create policy "rel contributor write" on relationships for all using (exists (select 1 from tree_contributors tc where tc.tree_id = relationships.tree_id and tc.user_id = auth.uid() and tc.role in ('owner','editor')));
create policy "rel viewer read" on relationships for select using (exists (select 1 from family_trees ft left join tree_contributors tc on tc.tree_id = ft.id and tc.user_id = auth.uid() where ft.id = relationships.tree_id and (ft.is_public = true or tc.user_id is not null)));

alter table tree_members enable row level security;
create policy "tm owner manage" on tree_members for all using (exists (select 1 from family_trees ft where ft.id = tree_members.tree_id and ft.owner_id = auth.uid()));
create policy "tm public read" on tree_members for select using (exists (select 1 from family_trees ft left join tree_contributors tc on tc.tree_id = ft.id and tc.user_id = auth.uid() where ft.id = tree_members.tree_id and (ft.is_public = true or tc.user_id is not null)));

alter table tree_contributors enable row level security;
create policy "tc owner manages" on tree_contributors for all using (exists (select 1 from family_trees ft where ft.id = tree_contributors.tree_id and ft.owner_id = auth.uid()));
create policy "tc self read" on tree_contributors for select using (user_id = auth.uid());

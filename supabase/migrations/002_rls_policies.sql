-- ── family_trees ──────────────────────────────────────────────────────────────
alter table family_trees enable row level security;

create policy "owner full access" on family_trees
  for all using (owner_id = auth.uid());

create policy "public read" on family_trees
  for select using (is_public = true);

create policy "contributor read" on family_trees
  for select using (
    exists (
      select 1 from tree_contributors tc
      where tc.tree_id = id and tc.user_id = auth.uid()
    )
  );

-- ── people ────────────────────────────────────────────────────────────────────
alter table people enable row level security;

create policy "creator access" on people
  for all using (created_by = auth.uid());

create policy "contributor write" on people
  for all using (
    exists (
      select 1 from tree_members tm
      join tree_contributors tc on tc.tree_id = tm.tree_id
      where tm.person_id = id
        and tc.user_id = auth.uid()
        and tc.role in ('owner','editor')
    )
  );

create policy "viewer read" on people
  for select using (
    exists (
      select 1 from tree_members tm
      join family_trees ft on ft.id = tm.tree_id
      left join tree_contributors tc on tc.tree_id = tm.tree_id and tc.user_id = auth.uid()
      where tm.person_id = id
        and (ft.is_public = true or tc.user_id is not null)
    )
  );

-- ── relationships ─────────────────────────────────────────────────────────────
alter table relationships enable row level security;

create policy "contributor write" on relationships
  for all using (
    exists (
      select 1 from tree_contributors tc
      where tc.tree_id = relationships.tree_id
        and tc.user_id = auth.uid()
        and tc.role in ('owner','editor')
    )
  );

create policy "viewer or public read" on relationships
  for select using (
    exists (
      select 1 from family_trees ft
      left join tree_contributors tc on tc.tree_id = ft.id and tc.user_id = auth.uid()
      where ft.id = relationships.tree_id
        and (ft.is_public = true or tc.user_id is not null)
    )
  );

-- ── tree_members ──────────────────────────────────────────────────────────────
alter table tree_members enable row level security;

create policy "owner manage" on tree_members
  for all using (
    exists (
      select 1 from family_trees ft
      where ft.id = tree_id and ft.owner_id = auth.uid()
    )
  );

create policy "contributor or public read" on tree_members
  for select using (
    exists (
      select 1 from family_trees ft
      left join tree_contributors tc on tc.tree_id = ft.id and tc.user_id = auth.uid()
      where ft.id = tree_id
        and (ft.is_public = true or tc.user_id is not null)
    )
  );

-- ── tree_contributors ─────────────────────────────────────────────────────────
alter table tree_contributors enable row level security;

create policy "owner manages contributors" on tree_contributors
  for all using (
    exists (
      select 1 from family_trees ft
      where ft.id = tree_id and ft.owner_id = auth.uid()
    )
  );

create policy "self read" on tree_contributors
  for select using (user_id = auth.uid());

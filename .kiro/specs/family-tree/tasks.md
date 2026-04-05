# Implementation Plan: Family Tree Application

## Overview

Incremental build starting from project scaffolding through to UI polish. Each phase produces working, integrated code. Property-based tests (fast-check) are placed close to the implementation they validate.

## Tasks

- [-] 1. Project scaffolding
  - [x] 1.1 Initialise Vite + React + TypeScript project
    - Run `npm create vite@latest family-tree -- --template react-ts`
    - Configure `tsconfig.json` with strict mode and path aliases (`@/` → `src/`)
    - _Requirements: —_

  - [x] 1.2 Install and configure Tailwind CSS v3
    - Install `tailwindcss`, `postcss`, `autoprefixer`
    - Create `tailwind.config.ts` with `darkMode: 'class'` and content paths
    - Add Tailwind directives to `src/index.css`
    - _Requirements: —_

  - [ ] 1.3 Install and configure shadcn/ui
    - Run `npx shadcn-ui@latest init` (choose TypeScript, Tailwind, `@/` alias)
    - Add base components: Button, Input, Dialog, Sheet, Toast, Avatar, Badge, Select, Tooltip
    - _Requirements: —_

  - [x] 1.4 Install remaining runtime dependencies
    - `@supabase/supabase-js`, `zustand`, `react-router-dom`
    - `reactflow`, `dagre`, `@types/dagre`
    - `html2canvas`, `fast-check`, `vitest`, `@testing-library/react`
    - _Requirements: —_

  - [ ] 1.5 Set up Vitest with jsdom
    - Add `vitest.config.ts` with jsdom environment and `@/` alias
    - Add `src/setupTests.ts` with `@testing-library/jest-dom` matchers
    - _Requirements: —_

  - [x] 1.6 Create domain type definitions
    - Write `src/types/index.ts` with `Person`, `FamilyTree`, `Relationship`, `Contributor`, `RelationshipType`, `ContributorRole` interfaces matching the design document
    - _Requirements: 2.1, 4.1, 6.1, 7.1_

  - [x] 1.7 Create project directory structure
    - Create `src/lib/`, `src/hooks/`, `src/components/`, `src/pages/`, `src/__tests__/`, `src/store/`
    - Add barrel `index.ts` files where appropriate
    - _Requirements: —_

- [ ] 2. Supabase setup
  - [x] 2.1 Create Supabase project and configure environment variables
    - Add `.env.local` with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
    - Create `src/lib/supabase.ts` exporting the typed `supabase` client
    - _Requirements: 10.1_

  - [x] 2.2 Write database migration: core tables
    - Create `supabase/migrations/001_initial_schema.sql`
    - Include `people`, `family_trees`, `tree_members`, `relationships` (with enum type), `tree_contributors` (with enum type) exactly as specified in the design
    - Include all `CHECK` constraints (`death_after_birth`, `no_self_relationship`, `divorce_after_marriage`)
    - _Requirements: 2.1, 4.2, 6.1, 10.3, 10.4_

  - [x] 2.3 Write RLS policies migration
    - Create `supabase/migrations/002_rls_policies.sql`
    - Implement all policies from the design for `family_trees`, `people`, `relationships`, `tree_members`, `tree_contributors`
    - _Requirements: 2.8, 4.7, 6.8, 7.4, 7.8, 10.1, 10.2_

  - [ ] 2.4 Write Postgres triggers migration
    - Create `supabase/migrations/003_triggers.sql`
    - Add `AFTER DELETE` trigger on `people` to invoke `delete-cloudinary-asset` Edge Function
    - Add `AFTER DELETE` trigger on `tree_members` to nullify `branch_root_person_id` and insert into `notifications`
    - _Requirements: 3.6, 10.5_

  - [ ] 2.5 Scaffold Supabase Edge Functions
    - Create `supabase/functions/create-relationship/index.ts` — server-side cycle check via recursive CTE + insert
    - Create `supabase/functions/delete-cloudina
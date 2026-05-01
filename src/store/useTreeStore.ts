import { create } from 'zustand'
import type { FamilyTree, Person, Relationship, Contributor } from '@/types'

interface TreeStore {
  currentTree: FamilyTree | null
  people: Person[]
  relationships: Relationship[]
  contributors: Contributor[]
  setCurrentTree: (tree: FamilyTree | null) => void
  setPeople: (people: Person[]) => void
  setRelationships: (rels: Relationship[]) => void
  setContributors: (contributors: Contributor[]) => void
  upsertPerson: (person: Person) => void
  removePerson: (personId: string) => void
  upsertRelationship: (rel: Relationship) => void
  removeRelationship: (relId: string) => void
}

export const useTreeStore = create<TreeStore>((set) => ({
  currentTree: null,
  people: [],
  relationships: [],
  contributors: [],

  setCurrentTree: (tree) => set({ currentTree: tree }),
  setPeople: (people) => set({ people }),
  setRelationships: (relationships) => set({ relationships }),
  setContributors: (contributors) => set({ contributors }),

  upsertPerson: (person) =>
    set((s) => ({
      people: s.people.some((p) => p.id === person.id)
        ? s.people.map((p) => (p.id === person.id ? person : p))
        : [...s.people, person],
    })),

  removePerson: (personId) =>
    set((s) => ({
      people: s.people.filter((p) => p.id !== personId),
      relationships: s.relationships.filter(
        (r) => r.personAId !== personId && r.personBId !== personId
      ),
    })),

  upsertRelationship: (rel) =>
    set((s) => ({
      relationships: s.relationships.some((r) => r.id === rel.id)
        ? s.relationships.map((r) => (r.id === rel.id ? rel : r))
        : [...s.relationships, rel],
    })),

  removeRelationship: (relId) =>
    set((s) => ({
      relationships: s.relationships.filter((r) => r.id !== relId),
    })),
}))

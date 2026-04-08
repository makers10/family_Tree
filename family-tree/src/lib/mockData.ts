import type { Person, FamilyTree, Relationship } from '@/types'

export const MOCK_TREES: FamilyTree[] = [
  { id: 'tree-1', name: 'The Smith Family', ownerId: 'user-1', isPublic: false, createdAt: '2024-01-01', privacyLevel: 'private' },
  { id: 'tree-2', name: 'The Johnson Family', ownerId: 'user-1', isPublic: true, createdAt: '2024-02-01', privacyLevel: 'public' },
  { id: 'tree-3', name: 'The Williams Family', ownerId: 'user-2', isPublic: false, createdAt: '2024-03-01', privacyLevel: 'contributors_only' },
]

export const MOCK_PEOPLE: Person[] = [
  { id: 'p1', fullName: 'Robert Smith', birthDate: '1945-03-12', deathDate: null, bio: 'Patriarch of the Smith family. Retired engineer.', gender: 'male', photoUrl: null, cloudinaryPublicId: null, createdBy: 'user-1', createdAt: '2024-01-01', privacyLevel: 'public' },
  { id: 'p2', fullName: 'Margaret Smith', birthDate: '1948-07-22', deathDate: null, bio: 'Matriarch. Loves gardening and cooking.', gender: 'female', photoUrl: null, cloudinaryPublicId: null, createdBy: 'user-1', createdAt: '2024-01-01', privacyLevel: 'public' },
  { id: 'p3', fullName: 'James Smith', birthDate: '1972-05-15', deathDate: null, bio: 'Software engineer. Married to Sarah.', gender: 'male', photoUrl: null, cloudinaryPublicId: null, createdBy: 'user-1', createdAt: '2024-01-01', privacyLevel: 'contributors_only' },
  { id: 'p4', fullName: 'Sarah Smith', birthDate: '1975-09-03', deathDate: null, bio: 'Doctor. Loves hiking.', gender: 'female', photoUrl: null, cloudinaryPublicId: null, createdBy: 'user-1', createdAt: '2024-01-01', privacyLevel: 'private' },
  { id: 'p5', fullName: 'Emily Smith', birthDate: '2000-11-20', deathDate: null, bio: 'University student studying arts.', gender: 'female', photoUrl: null, cloudinaryPublicId: null, createdBy: 'user-1', createdAt: '2024-01-01', privacyLevel: 'private' },
  { id: 'p6', fullName: 'Oliver Smith', birthDate: '2003-04-08', deathDate: null, bio: 'High school student.', gender: 'male', photoUrl: null, cloudinaryPublicId: null, createdBy: 'user-1', createdAt: '2024-01-01', privacyLevel: 'private' },
  { id: 'p7', fullName: 'Diana Smith', birthDate: '1978-12-01', deathDate: null, bio: 'James\'s sister. Architect.', gender: 'female', photoUrl: null, cloudinaryPublicId: null, createdBy: 'user-1', createdAt: '2024-01-01', privacyLevel: 'public' },
]

export const MOCK_RELATIONSHIPS: Relationship[] = [
  { id: 'r1', treeId: 'tree-1', personAId: 'p1', personBId: 'p2', relationshipType: 'spouse', isBiological: false, marriedOn: '1970-06-15', divorcedOn: null },
  { id: 'r2', treeId: 'tree-1', personAId: 'p1', personBId: 'p3', relationshipType: 'parent_child', isBiological: true, marriedOn: null, divorcedOn: null },
  { id: 'r3', treeId: 'tree-1', personAId: 'p1', personBId: 'p7', relationshipType: 'parent_child', isBiological: true, marriedOn: null, divorcedOn: null },
  { id: 'r4', treeId: 'tree-1', personAId: 'p2', personBId: 'p3', relationshipType: 'parent_child', isBiological: true, marriedOn: null, divorcedOn: null },
  { id: 'r5', treeId: 'tree-1', personAId: 'p2', personBId: 'p7', relationshipType: 'parent_child', isBiological: true, marriedOn: null, divorcedOn: null },
  { id: 'r6', treeId: 'tree-1', personAId: 'p3', personBId: 'p4', relationshipType: 'spouse', isBiological: false, marriedOn: '1998-08-20', divorcedOn: null },
  { id: 'r7', treeId: 'tree-1', personAId: 'p3', personBId: 'p5', relationshipType: 'parent_child', isBiological: true, marriedOn: null, divorcedOn: null },
  { id: 'r8', treeId: 'tree-1', personAId: 'p3', personBId: 'p6', relationshipType: 'parent_child', isBiological: true, marriedOn: null, divorcedOn: null },
  { id: 'r9', treeId: 'tree-1', personAId: 'p5', personBId: 'p6', relationshipType: 'sibling', isBiological: true, marriedOn: null, divorcedOn: null },
]

// Current logged-in user (demo)
export const CURRENT_USER_ID = 'user-1'

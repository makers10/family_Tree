export type RelationshipType = 'parent_child' | 'spouse' | 'sibling' | 'extramarital'
export type ContributorRole = 'owner' | 'editor' | 'viewer'
export type Gender = 'male' | 'female' | 'other'
export type PrivacyLevel = 'public' | 'private' | 'contributors_only'

export interface Person {
  id: string
  fullName: string
  birthDate: string | null
  deathDate: string | null
  bio: string | null
  gender: Gender | null
  photoUrl: string | null
  cloudinaryPublicId: string | null
  gotra: string | null
  nakshatra: string | null
  rashi: string | null
  nativeVillage: string | null
  createdBy: string
  createdAt: string
  privacyLevel?: PrivacyLevel
}

export interface FamilyTree {
  id: string
  name: string
  ownerId: string
  isPublic: boolean
  inviteToken: string
  createdAt: string
  privacyLevel?: PrivacyLevel
  allowedViewers?: string[]
}

export interface Relationship {
  id: string
  treeId: string
  personAId: string
  personBId: string
  relationshipType: RelationshipType
  isBiological: boolean
  marriedOn: string | null
  divorcedOn: string | null
}

export interface Contributor {
  id: string
  treeId: string
  userId: string
  role: ContributorRole
  branchRootPersonId: string | null
}

export interface PersonNodeData {
  personId: string
  fullName: string
  photoUrl: string | null
  gender: Gender | null
  birthDate: string | null
  deathDate: string | null
  isSelected: boolean
}

export interface RelationshipEdgeData {
  relationshipId: string
  relationshipType: RelationshipType
  isBiological: boolean
  marriedOn: string | null
  divorcedOn: string | null
}

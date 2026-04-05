import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useTreeStore } from '@/store/useTreeStore'
import type { Person } from '@/types'

function mapRow(row: Record<string, unknown>): Person {
  return {
    id: row.id as string,
    fullName: row.full_name as string,
    birthDate: (row.birth_date as string) ?? null,
    deathDate: (row.death_date as string) ?? null,
    bio: (row.bio as string) ?? null,
    gender: (row.gender as Person['gender']) ?? null,
    photoUrl: (row.photo_url as string) ?? null,
    cloudinaryPublicId: (row.cloudinary_public_id as string) ?? null,
    createdBy: row.created_by as string,
    createdAt: row.created_at as string,
  }
}

export function usePeople(treeId: string | undefined) {
  const [loading, setLoading] = useState(false)
  const { setPeople, upsertPerson, removePerson } = useTreeStore()

  useEffect(() => {
    if (!treeId) return
    setLoading(true)
    supabase
      .from('tree_members')
      .select('people(*)')
      .eq('tree_id', treeId)
      .then(({ data, error }) => {
        if (!error && data) {
          const people = data
            .map((row) => (row.people as unknown) as Record<string, unknown> | null)
            .filter(Boolean)
            .map((p) => mapRow(p!))
          setPeople(people)
        }
        setLoading(false)
      })
  }, [treeId, setPeople])

  async function createPerson(
    treeId: string,
    input: Omit<Person, 'id' | 'createdBy' | 'createdAt'>
  ): Promise<Person> {
    const { data, error } = await supabase
      .from('people')
      .insert({
        full_name: input.fullName,
        birth_date: input.birthDate,
        death_date: input.deathDate,
        bio: input.bio,
        gender: input.gender,
        photo_url: input.photoUrl,
        cloudinary_public_id: input.cloudinaryPublicId,
      })
      .select()
      .single()
    if (error) throw new Error(error.message)
    const person = mapRow(data)

    // Add to tree_members
    await supabase.from('tree_members').insert({ tree_id: treeId, person_id: person.id })
    upsertPerson(person)
    return person
  }

  async function updatePerson(id: string, input: Partial<Omit<Person, 'id' | 'createdBy' | 'createdAt'>>) {
    const payload: Record<string, unknown> = {}
    if (input.fullName !== undefined) payload.full_name = input.fullName
    if (input.birthDate !== undefined) payload.birth_date = input.birthDate
    if (input.deathDate !== undefined) payload.death_date = input.deathDate
    if (input.bio !== undefined) payload.bio = input.bio
    if (input.gender !== undefined) payload.gender = input.gender
    if (input.photoUrl !== undefined) payload.photo_url = input.photoUrl
    if (input.cloudinaryPublicId !== undefined) payload.cloudinary_public_id = input.cloudinaryPublicId

    const { data, error } = await supabase
      .from('people')
      .update(payload)
      .eq('id', id)
      .select()
      .single()
    if (error) throw new Error(error.message)
    const person = mapRow(data)
    upsertPerson(person)
    return person
  }

  async function deletePerson(id: string) {
    const { error } = await supabase.from('people').delete().eq('id', id)
    if (error) throw new Error(error.message)
    removePerson(id)
  }

  return { loading, createPerson, updatePerson, deletePerson }
}

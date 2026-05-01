import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useTreeStore } from '@/store/useTreeStore'
import { wouldCreateCycle } from '@/lib/treeBuilder'
import type { Relationship } from '@/types'

function mapRow(row: Record<string, unknown>): Relationship {
  return {
    id: row.id as string,
    treeId: row.tree_id as string,
    personAId: row.person_a_id as string,
    personBId: row.person_b_id as string,
    relationshipType: row.relationship_type as Relationship['relationshipType'],
    isBiological: row.is_biological as boolean,
    marriedOn: (row.married_on as string) ?? null,
    divorcedOn: (row.divorced_on as string) ?? null,
  }
}

export function useRelationships(treeId: string | undefined) {
  const [loading, setLoading] = useState(false)
  const { relationships, setRelationships, upsertRelationship, removeRelationship } = useTreeStore()

  useEffect(() => {
    if (!treeId) return
    setLoading(true)
    supabase
      .from('relationships')
      .select('*')
      .eq('tree_id', treeId)
      .then(({ data, error }) => {
        if (!error && data) setRelationships(data.map(mapRow))
        setLoading(false)
      })
  }, [treeId, setRelationships])

  async function createRelationship(
    input: Omit<Relationship, 'id'>
  ): Promise<Relationship> {
    if (input.personAId === input.personBId) {
      throw new Error('A person cannot be related to themselves.')
    }

    if (input.relationshipType === 'parent_child') {
      if (wouldCreateCycle(input.personAId, input.personBId, relationships)) {
        throw new Error('This relationship would create a circular ancestry chain.')
      }
    }

    if (input.marriedOn && input.divorcedOn && input.divorcedOn < input.marriedOn) {
      throw new Error('Divorce date cannot be before marriage date.')
    }

    const { data, error } = await supabase
      .from('relationships')
      .insert({
        tree_id: input.treeId,
        person_a_id: input.personAId,
        person_b_id: input.personBId,
        relationship_type: input.relationshipType,
        is_biological: input.isBiological,
        married_on: input.marriedOn,
        divorced_on: input.divorcedOn,
      })
      .select()
      .single()
    if (error) throw new Error(error.message)
    const rel = mapRow(data)
    upsertRelationship(rel)
    return rel
  }

  async function deleteRelationship(id: string) {
    const { error } = await supabase.from('relationships').delete().eq('id', id)
    if (error) throw new Error(error.message)
    removeRelationship(id)
  }

  return { loading, createRelationship, deleteRelationship }
}

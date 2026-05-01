import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { FamilyTree } from '@/types'

function mapRow(row: Record<string, unknown>): FamilyTree {
  return {
    id: row.id as string,
    name: row.name as string,
    ownerId: row.owner_id as string,
    isPublic: row.is_public as boolean,
    inviteToken: row.invite_token as string,
    createdAt: row.created_at as string,
  }
}

export function useTrees() {
  const [trees, setTrees] = useState<FamilyTree[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTrees()
  }, [])

  async function fetchTrees() {
    setLoading(true)
    const { data, error } = await supabase
      .from('family_trees')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) { setError(error.message); setLoading(false); return }
    setTrees((data ?? []).map(mapRow))
    setLoading(false)
  }

  async function createTree(name: string): Promise<FamilyTree> {
    const { data, error } = await supabase
      .from('family_trees')
      .insert({ name })
      .select()
      .single()
    if (error) throw new Error(error.message)
    const tree = mapRow(data)
    setTrees((prev) => [tree, ...prev])
    return tree
  }

  async function updateTree(id: string, updates: Partial<Pick<FamilyTree, 'name' | 'isPublic'>>) {
    const payload: Record<string, unknown> = {}
    if (updates.name !== undefined) payload.name = updates.name
    if (updates.isPublic !== undefined) payload.is_public = updates.isPublic
    const { data, error } = await supabase
      .from('family_trees')
      .update(payload)
      .eq('id', id)
      .select()
      .single()
    if (error) throw new Error(error.message)
    const tree = mapRow(data)
    setTrees((prev) => prev.map((t) => (t.id === id ? tree : t)))
    return tree
  }

  async function deleteTree(id: string) {
    const { error } = await supabase.from('family_trees').delete().eq('id', id)
    if (error) throw new Error(error.message)
    setTrees((prev) => prev.filter((t) => t.id !== id))
  }

  return { trees, loading, error, createTree, updateTree, deleteTree, refetch: fetchTrees }
}

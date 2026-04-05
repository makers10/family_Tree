import dagre from 'dagre'
import type { Node, Edge } from 'reactflow'
import type { Person, Relationship, PersonNodeData, RelationshipEdgeData } from '@/types'

const NODE_WIDTH = 160
const NODE_HEIGHT = 90

export const EDGE_STYLES: Record<string, { stroke: string; strokeDasharray?: string; strokeWidth: number }> = {
  parent_child: { stroke: '#6366f1', strokeWidth: 2 },
  spouse:       { stroke: '#ec4899', strokeWidth: 2, strokeDasharray: '8 3' },
  sibling:      { stroke: '#22c55e', strokeWidth: 2, strokeDasharray: '4 4' },
  extramarital: { stroke: '#f97316', strokeWidth: 2, strokeDasharray: '2 4' },
}

export function buildGraphFromRelationships(
  people: Person[],
  relationships: Relationship[],
  options: { centerPersonId?: string } = {}
): { nodes: Node<PersonNodeData>[]; edges: Edge<RelationshipEdgeData>[] } {
  const g = new dagre.graphlib.Graph()
  g.setGraph({ rankdir: 'TB', nodesep: 80, ranksep: 120 })
  g.setDefaultEdgeLabel(() => ({}))

  const nodes: Node<PersonNodeData>[] = people.map((p) => {
    g.setNode(p.id, { width: NODE_WIDTH, height: NODE_HEIGHT })
    return {
      id: p.id,
      type: 'personNode',
      position: { x: 0, y: 0 },
      data: {
        personId: p.id,
        fullName: p.fullName,
        photoUrl: p.photoUrl,
        gender: p.gender,
        birthDate: p.birthDate,
        deathDate: p.deathDate,
        isSelected: p.id === options.centerPersonId,
      },
    }
  })

  // Only parent_child drives the dagre hierarchy
  relationships
    .filter((r) => r.relationshipType === 'parent_child')
    .forEach((r) => g.setEdge(r.personAId, r.personBId))

  dagre.layout(g)

  nodes.forEach((n) => {
    const pos = g.node(n.id)
    if (pos) {
      n.position = { x: pos.x - NODE_WIDTH / 2, y: pos.y - NODE_HEIGHT / 2 }
    }
  })

  const edges: Edge<RelationshipEdgeData>[] = relationships.map((r) => ({
    id: r.id,
    source: r.personAId,
    target: r.personBId,
    type: 'relationshipEdge',
    data: {
      relationshipId: r.id,
      relationshipType: r.relationshipType,
      isBiological: r.isBiological,
      marriedOn: r.marriedOn,
      divorcedOn: r.divorcedOn,
    },
    style: EDGE_STYLES[r.relationshipType],
  }))

  return { nodes, edges }
}

export function wouldCreateCycle(
  parentId: string,
  childId: string,
  relationships: Relationship[]
): boolean {
  const childrenOf = new Map<string, string[]>()
  for (const r of relationships) {
    if (r.relationshipType !== 'parent_child') continue
    const list = childrenOf.get(r.personAId) ?? []
    list.push(r.personBId)
    childrenOf.set(r.personAId, list)
  }

  // BFS upward from parentId — if we reach childId, it's a cycle
  const visited = new Set<string>()
  const queue: string[] = [parentId]
  while (queue.length > 0) {
    const current = queue.shift()!
    if (current === childId) return true
    if (visited.has(current)) continue
    visited.add(current)
    for (const child of childrenOf.get(current) ?? []) {
      queue.push(child)
    }
  }
  return false
}

export function getBranchDescendants(
  rootPersonId: string,
  relationships: Relationship[]
): Set<string> {
  const childrenOf = new Map<string, string[]>()
  for (const r of relationships) {
    if (r.relationshipType !== 'parent_child') continue
    const list = childrenOf.get(r.personAId) ?? []
    list.push(r.personBId)
    childrenOf.set(r.personAId, list)
  }

  const result = new Set<string>([rootPersonId])
  const queue = [rootPersonId]
  while (queue.length > 0) {
    const current = queue.shift()!
    for (const child of childrenOf.get(current) ?? []) {
      if (!result.has(child)) {
        result.add(child)
        queue.push(child)
      }
    }
  }
  return result
}

export function getPeopleAtGeneration(
  rootPersonId: string,
  targetGeneration: number,
  relationships: Relationship[]
): string[] {
  const childrenOf = new Map<string, string[]>()
  for (const r of relationships) {
    if (r.relationshipType !== 'parent_child') continue
    const list = childrenOf.get(r.personAId) ?? []
    list.push(r.personBId)
    childrenOf.set(r.personAId, list)
  }

  let current = new Set([rootPersonId])
  for (let gen = 1; gen < targetGeneration; gen++) {
    const next = new Set<string>()
    for (const p of current) {
      for (const child of childrenOf.get(p) ?? []) next.add(child)
    }
    current = next
  }
  return [...current]
}

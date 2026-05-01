import { useCallback, useMemo, useRef } from 'react'
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  type ReactFlowInstance,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { useTreeStore } from '@/store/useTreeStore'
import { buildGraphFromRelationships } from '@/lib/treeBuilder'
import { PersonNode } from './PersonNode'
import { RelationshipEdge } from './RelationshipEdge'
import type { PersonNodeData } from '@/types'

const nodeTypes = { personNode: PersonNode }
const edgeTypes = { relationshipEdge: RelationshipEdge }

interface FamilyTreeCanvasProps {
  onNodeClick?: (personId: string) => void
  canvasRef?: React.RefObject<HTMLDivElement | null>
}

export function FamilyTreeCanvas({ onNodeClick, canvasRef }: FamilyTreeCanvasProps) {
  const { people, relationships } = useTreeStore()
  const rfInstance = useRef<ReactFlowInstance | null>(null)

  const { nodes: initialNodes, edges: initialEdges } = useMemo(
    () => buildGraphFromRelationships(people, relationships),
    [people, relationships]
  )

  const [nodes, , onNodesChange] = useNodesState(initialNodes)
  const [edges, , onEdgesChange] = useEdgesState(initialEdges)

  const handleNodeClick = useCallback(
    (_: React.MouseEvent, node: { data: PersonNodeData }) => {
      onNodeClick?.(node.data.personId)
    },
    [onNodeClick]
  )

  if (people.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 text-slate-400 dark:text-slate-500">
        <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-12 h-12 opacity-40" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
          </svg>
        </div>
        <div className="text-center">
          <p className="font-semibold text-slate-600 dark:text-slate-400">No people yet</p>
          <p className="text-sm mt-1">Add the first person to start building your family tree.</p>
        </div>
      </div>
    )
  }

  return (
    <div ref={canvasRef} className="flex-1 w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick as never}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onInit={(instance) => { rfInstance.current = instance }}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.1}
        maxZoom={2}
        attributionPosition="bottom-left"
      >
        <Background color="#e2e8f0" gap={20} />
        <Controls className="!shadow-md !rounded-xl !border-slate-200 dark:!border-slate-700" />
        <MiniMap
          nodeColor={(n) => {
            const gender = (n.data as PersonNodeData)?.gender
            return gender === 'male' ? '#93c5fd' : gender === 'female' ? '#f9a8d4' : '#c4b5fd'
          }}
          className="!rounded-xl !border-slate-200 dark:!border-slate-700"
        />
      </ReactFlow>
    </div>
  )
}

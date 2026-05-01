import { memo } from 'react'
import { getBezierPath, type EdgeProps } from 'reactflow'
import { EDGE_STYLES } from '@/lib/treeBuilder'
import type { RelationshipEdgeData } from '@/types'

const LABELS: Record<string, string> = {
  parent_child: '',
  spouse: '♥',
  sibling: '~',
  extramarital: '◆',
}

export const RelationshipEdge = memo(({
  id, sourceX, sourceY, targetX, targetY,
  sourcePosition, targetPosition, data,
}: EdgeProps<RelationshipEdgeData>) => {
  const [edgePath] = getBezierPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition })
  const style = data ? EDGE_STYLES[data.relationshipType] : EDGE_STYLES.parent_child
  const label = data ? LABELS[data.relationshipType] : ''

  return (
    <>
      <path
        id={id}
        className="react-flow__edge-path"
        d={edgePath}
        strokeWidth={style.strokeWidth}
        stroke={style.stroke}
        strokeDasharray={style.strokeDasharray}
        fill="none"
      />
      {label && (
        <text>
          <textPath href={`#${id}`} startOffset="50%" textAnchor="middle" style={{ fontSize: 12, fill: style.stroke }}>
            {label}
          </textPath>
        </text>
      )}
    </>
  )
})
RelationshipEdge.displayName = 'RelationshipEdge'

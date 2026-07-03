"use client"

import type { DragEvent } from "react"
import { NODE_DEFS, DRAG_DATA_FORMAT, type BuilderNodeDef } from "./nodeTypes"

function NodeCard({ node }: { node: BuilderNodeDef }) {
  const Icon = node.icon

  function handleDragStart(event: DragEvent<HTMLDivElement>) {
    event.dataTransfer.setData(DRAG_DATA_FORMAT, node.type)
    event.dataTransfer.effectAllowed = "move"
  }

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="flex cursor-grab items-center gap-3 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2.5 transition-colors hover:bg-white/[0.05] active:cursor-grabbing"
    >
      <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-white/[0.06] text-white/70">
        <Icon size={15} />
      </div>
      <div className="min-w-0">
        <p className="truncate text-[13px] font-medium text-[#f0eee9]">{node.label}</p>
        <p className="truncate text-[11px] text-white/35">{node.description}</p>
      </div>
    </div>
  )
}

export default function NodeSidebar() {
  return (
    <aside className="flex w-64 shrink-0 flex-col gap-3 overflow-y-auto border-l border-white/[0.06] bg-[#0a0a0d] p-3">
      <span className="px-1 text-[11px] font-medium uppercase tracking-[0.06em] text-white/25">
        Nodes
      </span>
      {NODE_DEFS.map((node) => (
        <NodeCard key={node.type} node={node} />
      ))}
    </aside>
  )
}

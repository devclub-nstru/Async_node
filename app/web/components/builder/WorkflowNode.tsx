"use client"

import { memo } from "react"
import { Handle, Position, type NodeProps } from "reactflow"
import { getNodeDef, type BuilderNodeCategory } from "./nodeTypes"

function subtitleFor(category: BuilderNodeCategory | undefined, data: Record<string, unknown>) {
  if (category === "ai") return (data.provider as string) || "Choose provider"
  if (category === "http") return (data.method as string) || "Choose method"
  if (category === "trigger") return (data.type as string) || "Choose trigger"
  if (category === "email") return (data.to as string) || "Not configured"
  if (category === "slack") return (data.webhookUrl as string) ? "Configured" : "Not configured"
  return undefined
}

function WorkflowNode({ data, selected }: NodeProps) {
  const category = data?.category as BuilderNodeCategory | undefined
  const def = getNodeDef(category)
  const Icon = def?.icon
  const color = def?.color ?? "#8b8b93"
  const subtitle = subtitleFor(category, data ?? {})

  return (
    <div
      className="flex min-w-[190px] items-center gap-3 rounded-xl border bg-[#161618] px-3 py-2.5 shadow-lg transition-colors"
      style={{
        borderColor: selected ? color : "rgba(255,255,255,0.08)",
        boxShadow: selected ? `0 0 0 1px ${color}, 0 8px 24px -8px ${color}55` : undefined,
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!size-2.5 !border-2 !border-[#161618]"
        style={{ background: color }}
      />

      <div
        className="flex size-8 shrink-0 items-center justify-center rounded-lg"
        style={{ background: `${color}1f`, color }}
      >
        {Icon && <Icon size={16} />}
      </div>

      <div className="min-w-0">
        <p className="truncate text-[13px] font-medium text-[#f0eee9]">{data?.label as string}</p>
        {subtitle && <p className="truncate text-[11px] text-white/40">{subtitle}</p>}
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="!size-2.5 !border-2 !border-[#161618]"
        style={{ background: color }}
      />
    </div>
  )
}

export default memo(WorkflowNode)

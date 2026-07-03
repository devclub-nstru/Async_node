"use client"

import { X } from "lucide-react"
import type { Node } from "reactflow"
import ConfigFieldInput from "./ConfigField"
import {
  AI_PROVIDERS,
  NODE_CONFIG_FIELDS,
  TRIGGER_CONFIG_FIELDS,
  getAIProviderFields,
  type AIProviderValue,
} from "./nodeConfigSchemas"
import { getNodeDef, type BuilderNodeCategory } from "./nodeTypes"

interface NodeConfigPanelProps {
  node: Node
  onChange: (nodeId: string, data: Record<string, unknown>) => void
  onClose: () => void
}

const PROVIDER_FIELD = {
  key: "provider",
  label: "Provider",
  type: "select" as const,
  required: true,
  options: AI_PROVIDERS.map((p) => ({ value: p.value, label: p.label })),
}

export default function NodeConfigPanel({ node, onChange, onClose }: NodeConfigPanelProps) {
  const category = node.data?.category as BuilderNodeCategory | undefined
  const def = getNodeDef(category)
  const label = def?.label ?? node.data?.label ?? "Node"
  const Icon = def?.icon
  const color = def?.color ?? "#8b8b93"

  function setField(key: string, value: string) {
    onChange(node.id, { ...node.data, [key]: value })
  }

  const fields =
    category === "ai"
      ? [PROVIDER_FIELD, ...getAIProviderFields(node.data?.provider as AIProviderValue | undefined)]
      : category === "trigger"
        ? TRIGGER_CONFIG_FIELDS
        : category
          ? NODE_CONFIG_FIELDS[category]
          : []

  return (
    <div className="flex w-64 shrink-0 flex-col gap-3 overflow-y-auto border-l border-white/[0.06] bg-[#0a0a0d] p-3">
      <div className="flex items-center justify-between px-1">
        <div className="flex min-w-0 items-center gap-2">
          {Icon && (
            <div
              className="flex size-6 shrink-0 items-center justify-center rounded-md"
              style={{ background: `${color}1f`, color }}
            >
              <Icon size={13} />
            </div>
          )}
          <span className="truncate text-[11px] font-medium uppercase tracking-[0.06em] text-white/25">
            Configure — {label}
          </span>
        </div>
        <button
          onClick={onClose}
          className="flex shrink-0 items-center justify-center rounded p-1 text-white/30 transition-colors hover:bg-white/[0.06] hover:text-white/70"
        >
          <X size={13} />
        </button>
      </div>

      {fields.length === 0 ? (
        <p className="px-1 text-[12px] text-white/30">No configuration needed for this node.</p>
      ) : (
        fields.map((field) => (
          <ConfigFieldInput
            key={field.key}
            field={field}
            value={(node.data?.[field.key] as string) ?? ""}
            onChange={(value) => setField(field.key, value)}
          />
        ))
      )}
    </div>
  )
}

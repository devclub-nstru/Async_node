"use client"

import { useState } from "react"
import { Loader2, Play, X } from "lucide-react"
import type { Node } from "reactflow"
import { toast } from "sonner"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { runWorkflow } from "@/services/workflows/runWorkflow"
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
  workflowId: number
  onChange: (nodeId: string, data: Record<string, unknown>) => void
  onClose: () => void
  disabled?: boolean
}

const PROVIDER_FIELD = {
  key: "provider",
  label: "Provider",
  type: "select" as const,
  required: true,
  options: AI_PROVIDERS.map((p) => ({ value: p.value, label: p.label })),
}

export default function NodeConfigPanel({ node, workflowId, onChange, onClose, disabled }: NodeConfigPanelProps) {
  const category = node.data?.category as BuilderNodeCategory | undefined
  const def = getNodeDef(category)
  const label = def?.label ?? node.data?.label ?? "Node"
  const Icon = def?.icon
  const color = def?.color ?? "#8b8b93"
  const isManualTrigger = category === "trigger" && (node.data?.type ?? "manual") === "manual"
  const [running, setRunning] = useState(false)

  function setField(key: string, value: string | Record<string, string>) {
    onChange(node.id, { ...node.data, [key]: value })
  }

  async function handleRun() {
    setRunning(true)
    try {
      const res = await runWorkflow(workflowId)
      toast.success("Workflow run completed")

    } catch (err) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message ?? "Failed to run workflow"
        : "Failed to run workflow"
      toast.error(message)
    } finally {
      setRunning(false)
    }
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
    <div className={`flex w-64 shrink-0 flex-col gap-3 overflow-y-auto border-l border-white/6 bg-[#0a0a0d] p-3 ${disabled ? "pointer-events-none opacity-70" : ""}`} aria-disabled={disabled}>
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
          disabled={disabled}
          className="flex shrink-0 items-center justify-center rounded p-1 text-white/30 transition-colors hover:bg-white/6 hover:text-white/70"
        >
          <X size={13} />
        </button>
      </div>

      <div className="flex items-center justify-between px-1">
        <span className="text-[10px] uppercase tracking-[0.06em] text-white/20">Node ID</span>
        <code className="truncate rounded bg-white/4 px-1.5 py-0.5 font-mono text-[10px] text-white/40">
          {node.id}
        </code>
      </div>

      {fields.length === 0 ? (
        <p className="px-1 text-[12px] text-white/30">No configuration needed for this node.</p>
      ) : (
        fields.map((field) => (
          <ConfigFieldInput
            key={field.key}
            field={field}
            value={node.data?.[field.key] ?? (field.type === "keyvalue" ? {} : "")}
            onChange={(value) => setField(field.key, value)}
            disabled={disabled}
          />
        ))
      )}

      {isManualTrigger && (
        <Button size="sm" className="w-full" onClick={handleRun} disabled={running || disabled}>
          {running ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
          {running ? "Running..." : "Run"}
        </Button>
      )}
    </div>
  )
}

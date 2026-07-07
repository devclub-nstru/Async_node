"use client"

import type { Node } from "reactflow"

interface NodeOutputTerminalProps {
  node: Node | null
  response?: unknown
}

function formatResponse(value: unknown) {
  if (value == null) return "No response yet."
  if (typeof value === "string") return value

  try {
    return JSON.stringify(value, null, 2)
  } catch {
    return "Unable to render response."
  }
}

export default function NodeOutputTerminal({ node, response }: NodeOutputTerminalProps) {
  const label = node?.data?.label as string | undefined
  const nodeId = node?.id

  return (
    <section className="shrink-0 border-t border-white/6 bg-[#09090c] px-4 py-3">
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-white/25">Terminal</p>
          <p className="truncate text-[12px] text-white/45">
            {nodeId ? `Output for ${label || "selected node"} (${nodeId})` : "Select a node to inspect its output"}
          </p>
        </div>
        <span className="rounded-full border border-white/8 bg-white/4 px-2 py-1 text-[10px] uppercase tracking-[0.08em] text-white/35">
          Response
        </span>
      </div>

      <div className="rounded-xl border border-white/8 bg-[#0d0d11] px-3 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
        <pre className="max-h-44 overflow-auto whitespace-pre-wrap wrap-break-word font-mono text-[11px] leading-5 text-white/75">
          {nodeId ? formatResponse(response) : "No node selected."}
        </pre>
      </div>
    </section>
  )
}
import { Workflow, MoreHorizontal } from "lucide-react"
import StatusPill from "./StatusPill"
import type { WorkflowItem } from "./types"

const COLUMNS = ["Name", "Status", "Runs", "Last run", ""]

interface WorkflowTableProps {
  workflows: WorkflowItem[]
}

function WorkflowRow({ wf, index }: { wf: WorkflowItem; index: number }) {
  return (
    <div
      className="grid grid-cols-[1fr_120px_80px_100px_40px] gap-4 items-center border-b border-white/[0.04] px-5 py-4 last:border-0 transition-colors hover:bg-white/[0.03] cursor-pointer"
      style={{ animationDelay: `${140 + index * 30}ms` }}
    >
      <div className="min-w-0">
        <p className="truncate text-[14px] font-medium text-[#f0eee9]">{wf.name}</p>
        <p className="truncate text-[12px] text-white/35">{wf.description}</p>
      </div>

      <StatusPill status={wf.status} />

      <span className="text-[13px] text-white/50">{wf.runs}</span>

      <span className="text-[12px] text-white/35">{wf.lastRun}</span>

      <button className="flex items-center justify-center rounded p-1 text-white/25 transition-colors hover:bg-white/10 hover:text-white/60">
        <MoreHorizontal size={14} />
      </button>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-16 text-white/30">
      <Workflow size={28} className="opacity-30" />
      <p className="text-[13px]">No workflows found</p>
    </div>
  )
}

export default function WorkflowTable({ workflows }: WorkflowTableProps) {
  return (
    <div
      className="dash-enter mb-6 overflow-hidden rounded-lg border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm"
      style={{ animationDelay: "140ms" }}
    >
      <div className="grid grid-cols-[1fr_120px_80px_100px_40px] gap-4 border-b border-white/[0.05] px-5 py-3">
        {COLUMNS.map((h) => (
          <span key={h} className="text-[11px] font-medium uppercase tracking-[0.06em] text-white/25">{h}</span>
        ))}
      </div>

      {workflows.length === 0 ? (
        <EmptyState />
      ) : (
        workflows.map((wf, i) => <WorkflowRow key={wf.id} wf={wf} index={i} />)
      )}
    </div>
  )
}

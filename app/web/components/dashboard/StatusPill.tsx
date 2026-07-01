import { CheckCircle2, Clock, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import type { WorkflowStatus } from "./types"

const STATUS_CFG: Record<WorkflowStatus, { label: string; cls: string; icon: React.ReactNode }> = {
  active:   { label: "Active",   cls: "bg-green-500/10 text-green-400 border-green-500/20",   icon: <CheckCircle2 size={11} /> },
  inactive: { label: "Inactive", cls: "bg-white/5 text-white/40 border-white/10",             icon: <Clock size={11} /> },
  error:    { label: "Error",    cls: "bg-red-500/10 text-red-400 border-red-500/20",         icon: <XCircle size={11} /> },
}

export default function StatusPill({ status }: { status: WorkflowStatus }) {
  const { label, cls, icon } = STATUS_CFG[status]
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium", cls)}>
      {icon}{label}
    </span>
  )
}

export type WorkflowStatus = "active" | "inactive" | "error"

export interface WorkflowItem {
  id: string
  name: string
  description: string
  status: WorkflowStatus
  lastRun: string
  runs: number
}

export const PAGE_SIZE = 8

export const MOCK_WORKFLOWS: WorkflowItem[] = Array.from({ length: 23 }, (_, i) => ({
  id: `wf-${i + 1}`,
  name: `Workflow ${i + 1}`,
  description: ["Sync CRM to Slack", "Email digest automation", "DB backup pipeline", "Alert on error", "Weekly report"][i % 5],
  status: (["active", "active", "inactive", "error", "active"] as WorkflowStatus[])[i % 5],
  lastRun: `${i + 1}h ago`,
  runs: Math.floor(Math.random() * 500) + 10,
}))

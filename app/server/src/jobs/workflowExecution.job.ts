import { WorkflowExecutionQueue } from "../config/queue/WorkflowExecution.queue.ts";

export type WorkflowExecutionJobData = {
  workflowId: number;
  userId: number;
  executionId: string;
};

export async function addWorkflowExecutionJob(data: WorkflowExecutionJobData) {
  return WorkflowExecutionQueue.add("run-workflow", data);
}

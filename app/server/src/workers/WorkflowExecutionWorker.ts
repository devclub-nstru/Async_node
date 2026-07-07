import { Worker, type Job } from "bullmq";
import { workflowQueueConnection } from "../config/queue/WorkflowExecution.queue.ts";
import { executeWorkflow } from "../modules/workflows/executor.services.ts";
import type { WorkflowExecutionJobData } from "../jobs/workflowExecution.job.ts";
import logger from "../utils/logger.ts";

const WORKFLOW_WORKER_CONCURRENCY = 5;

export const workflowExecutionWorker = new Worker<WorkflowExecutionJobData>(
  "run-workflow",
  async (job: Job<WorkflowExecutionJobData>) => {
    const { workflowId, userId, executionId } = job.data;

    const result = await executeWorkflow(workflowId, userId, executionId);

    if (result instanceof Error) {
      throw result;
    }

    return result;
  },
  { connection: workflowQueueConnection, concurrency: WORKFLOW_WORKER_CONCURRENCY }
);

workflowExecutionWorker.on("completed", (job) => {
  logger.info(`Workflow execution completed for job ${job.id} (execution ${job.data.executionId})`);
});

workflowExecutionWorker.on("failed", (job, err) => {
  logger.error(`Workflow execution job ${job?.id} failed`, err);
});

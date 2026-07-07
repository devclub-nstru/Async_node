import { getWorkflowById, getTriggersByWorkflowId, getIntegrationsByWorkflowId } from "./workflow.repo.ts";
import { workflows } from "../../db/schemas/workflow.schema.ts";
import { triggers } from "../../db/schemas/triggers.schema.ts";
import { integrations } from "../../db/schemas/integrations.schema.ts";
import { ERROR_MESSAGES } from "../../constants/messages.ts";
import { globalExecutor, type ExecutorEdge, type ExecutorNode } from "../../executors/global.executor.ts";

type GraphNode = { id: string; data?: Record<string, unknown> };
type GraphJson = { nodes: GraphNode[]; edges: unknown[] };

export const buildExecutionGraph = async (workflowId: number, userId: number) => {
    try {
        const workflow = await getWorkflowById(workflowId) as typeof workflows.$inferSelect | undefined;

        if (!workflow) {
            return new Error(ERROR_MESSAGES.WORKFLOW_NOT_FOUND);
        }

        if (workflow.userId !== userId) {
            return new Error(ERROR_MESSAGES.WORKFLOW_UPDATE_FORBIDDEN);
        }

        const graphJson = (workflow.graphJson ?? { nodes: [], edges: [] }) as GraphJson;
        const edges = graphJson.edges ?? [];

        const [triggerRows, integrationRows] = await Promise.all([
            getTriggersByWorkflowId(workflowId) as Promise<typeof triggers.$inferSelect[] | Error>,
            getIntegrationsByWorkflowId(workflowId) as Promise<typeof integrations.$inferSelect[] | Error>,
        ]);

        if (triggerRows instanceof Error) return triggerRows;
        if (integrationRows instanceof Error) return integrationRows;

        const triggersByNodeId = new Map(triggerRows.map((t) => [t.nodeId, t]));
        const integrationsByNodeId = new Map(integrationRows.map((i) => [i.nodeId, i]));

        const nodes: ExecutorNode[] = (graphJson.nodes ?? []).map((node) => {
            const trigger = triggersByNodeId.get(node.id);
            const integration = integrationsByNodeId.get(node.id);

            if (trigger) {
                return {
                    id: node.id,
                    type: trigger.type,
                    config: trigger.configJson as Record<string, any>,
                };
            }

            if (integration) {
                return {
                    id: node.id,
                    provider: integration.provider,
                    config: integration.credentialsJson as Record<string, any>,
                };
            }

            return { id: node.id, config: (node.data ?? {}) as Record<string, any> };
        });

        return { nodes, edges: edges as ExecutorEdge[] };
    } catch (err) {
        return err instanceof Error ? err : new Error(String(err));
    }
};

export const executeWorkflow = async (workflowId: number, userId: number, executionId: string) => {
    const graph = await buildExecutionGraph(workflowId, userId);

    if (graph instanceof Error) {
        return graph;
    }

    try {
        const executionContext = await globalExecutor(
            executionId,
            String(workflowId),
            graph.nodes,
            graph.edges
        );

        return executionContext;
    } catch (err) {
        return err instanceof Error ? err : new Error(String(err));
    }
};

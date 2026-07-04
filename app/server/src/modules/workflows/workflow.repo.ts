import { db } from "../../config/db.ts";
import { workflows } from "../../db/schemas/workflow.schema.ts";
import { triggers } from "../../db/schemas/triggers.schema.ts";
import { integrations } from "../../db/schemas/integrations.schema.ts";
import { eq } from "drizzle-orm";

export const getWorkflowsByUserId = async (userId: number) => {
    try{
        const result = await db.select().from(workflows).where(eq(workflows.userId, userId));
        return result
    }catch(err){
        return err
    }

}

export const getWorkflowById = async (workflowId: number) => {
    try{
        const result = await db.select().from(workflows).where(eq(workflows.id, workflowId));
        return result[0]
    }catch(err){
        return err
    }

}

export const deleteWorkflowById = async (workflowId: number) => {
    try{
        const result = await db.transaction(async (tx) => {
            await tx.delete(triggers).where(eq(triggers.workflowId, workflowId));
            await tx.delete(integrations).where(eq(integrations.workflowId, workflowId));

            const deleted = await tx.delete(workflows).where(eq(workflows.id, workflowId)).returning();
            return deleted[0]
        });
        return result
    }catch(err){
        return err
    }

}

export const saveWorkflowGraph = async (
    workflowId: number,
    graphJson: unknown,
    triggerRows: { nodeId: string; type: string; configJson: unknown }[],
    integrationRows: { nodeId: string; provider: string; credentialsJson: unknown }[]
) => {
    try {
        const result = await db.transaction(async (tx) => {
            const updated = await tx.update(workflows)
                .set({ graphJson, updatedAt: new Date() })
                .where(eq(workflows.id, workflowId))
                .returning();

            await tx.delete(triggers).where(eq(triggers.workflowId, workflowId));
            await tx.delete(integrations).where(eq(integrations.workflowId, workflowId));

            if (triggerRows.length > 0) {
                await tx.insert(triggers).values(
                    triggerRows.map((t) => ({ workflowId, nodeId: t.nodeId, type: t.type, configJson: t.configJson }))
                );
            }

            if (integrationRows.length > 0) {
                await tx.insert(integrations).values(
                    integrationRows.map((i) => ({ workflowId, nodeId: i.nodeId, provider: i.provider, credentialsJson: i.credentialsJson }))
                );
            }

            return updated[0]
        });

        return result
    } catch (err) {
        return err
    }
}
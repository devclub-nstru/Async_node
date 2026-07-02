import { db } from "../../config/db.ts";
import { workflows } from "../../db/schemas/workflow.schema.ts";
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
        const result = await db.delete(workflows).where(eq(workflows.id, workflowId)).returning();
        return result[0]
    }catch(err){
        return err
    }

}
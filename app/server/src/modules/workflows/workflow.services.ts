import { db } from "../../config/db.ts";
import { workflows } from "../../db/schemas/workflow.schema.ts";
import {getWorkflowById, getWorkflowsByUserId} from "./workflow.repo.ts";


export const createWorkflow = async (userId: number, name: string, description: string) => {
    try{
        if(!userId || !name || !description) {
            return new Error("Missing required fields");
        }

        const result = await db.insert(workflows).values({
            userId,
            name,
            description,
        }).returning();
        return result[0]
    }catch(err){
        return err
    }

}


export const getUserWorkflows = async (userId:number)=>{
    try{
        const result = await getWorkflowsByUserId(userId)
        return result
    }catch(err){
        return err
    }
}

export const getWorkflow = async (workflowId:number)=>{
    try{
        const result = await getWorkflowById(workflowId)

        if(!result) {
            return new Error("Workflow not found")
        }

        return result
    }catch(err){
        return err
    }
}
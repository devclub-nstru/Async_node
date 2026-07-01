import { createWorkflow, getUserWorkflows, getWorkflow } from "./workflow.services.ts";
import {httpResponse} from "../../utils/httpResponse.ts";
import {httpError} from "../../utils/httpError.ts";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../../constants/messages.ts";
import type { NextFunction, Request, Response, } from "express";


export const getUserWorkflowsController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            httpError(next, req, 401, ERROR_MESSAGES.UNAUTHORIZED);
            return;
        }
        const workflows = await getUserWorkflows(userId);

        httpResponse(res, req, 200, SUCCESS_MESSAGES.WORKFLOWS_RETRIEVED, workflows);
    } catch (error) {
        httpError(next, req, 500, ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
    }
};

export const getWorkflowController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const workflowId = parseInt(req.params.workflowId as string, 10);

        if (isNaN(workflowId)) {
            httpError(next, req, 400, ERROR_MESSAGES.WORKFLOW_INVALID_ID);
            return;
        }
        const workflow = await getWorkflow(workflowId);

        if (workflow instanceof Error) {
            httpError(next, req, 404, workflow.message);
            return;
        }

        httpResponse(res, req, 200, SUCCESS_MESSAGES.WORKFLOW_RETRIEVED, workflow);

    } catch (error) {
        httpError(next, req, 500, ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
    }
};


export const createWorkflowController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            httpError(next, req, 401, ERROR_MESSAGES.UNAUTHORIZED);
            return;
        }

        const { name, description } = req.body;

        if (!name || !description) {
            httpError(next, req, 400, ERROR_MESSAGES.WORKFLOW_MISSING_FIELDS);
            return;
        }

        const workflow = await createWorkflow(userId, name, description);

        if (workflow instanceof Error) {
            httpError(next, req, 400, workflow.message);
            return;
        }

        httpResponse(res, req, 201, SUCCESS_MESSAGES.WORKFLOW_CREATED, workflow);
    } catch (error) {
        httpError(next, req, 500, ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
    }
}



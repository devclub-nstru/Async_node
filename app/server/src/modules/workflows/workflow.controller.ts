import { createWorkflow, deleteWorkflow, getUserWorkflows, getWorkflow, updateWorkflowGraph } from "./workflow.services.ts";
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

export const deleteWorkflowController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            httpError(next, req, 401, ERROR_MESSAGES.UNAUTHORIZED);
            return;
        }

        const workflowId = parseInt(req.params.workflowId as string, 10);

        if (isNaN(workflowId)) {
            httpError(next, req, 400, ERROR_MESSAGES.WORKFLOW_INVALID_ID);
            return;
        }

        const workflow = await deleteWorkflow(workflowId, userId);

        if (workflow instanceof Error) {
            if (workflow.message === ERROR_MESSAGES.WORKFLOW_NOT_FOUND) {
                httpError(next, req, 404, workflow.message);
                return;
            }
            httpError(next, req, 400, workflow.message);
            return 
            httpError(next, req, 403, ERROR_MESSAGES.WORKFLOW_FORBIDDEN);
            return;
        }

        httpResponse(res, req, 200, SUCCESS_MESSAGES.WORKFLOW_DELETED, workflow);
    } catch (error) {
        httpError(next, req, 500, ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
    }
}

export const updateWorkflowGraphController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            httpError(next, req, 401, ERROR_MESSAGES.UNAUTHORIZED);
            return;
        }

        const workflowId = parseInt(req.params.workflowId as string, 10);

        if (isNaN(workflowId)) {
            httpError(next, req, 400, ERROR_MESSAGES.WORKFLOW_INVALID_ID);
            return;
        }

        const { graphJson } = req.body;

        if (!graphJson || !Array.isArray(graphJson.nodes) || !Array.isArray(graphJson.edges)) {
            httpError(next, req, 400, ERROR_MESSAGES.WORKFLOW_GRAPH_INVALID);
            return;
        }

        const workflow = await updateWorkflowGraph(workflowId, userId, graphJson);

        if (workflow instanceof Error) {
            if (workflow.message === ERROR_MESSAGES.WORKFLOW_NOT_FOUND) {
                httpError(next, req, 404, workflow.message);
                return;
            }
            if (workflow.message === "Too many nodes") {
                httpError(next, req, 400, ERROR_MESSAGES.WORKFLOW_TOO_MANY_NODES);
                return;
            }
            if (workflow.message === "Invalid graph") {
                httpError(next, req, 400, ERROR_MESSAGES.WORKFLOW_GRAPH_INVALID);
                return;
            }
            if (workflow.message === ERROR_MESSAGES.WORKFLOW_UPDATE_FORBIDDEN) {
                httpError(next, req, 403, ERROR_MESSAGES.WORKFLOW_UPDATE_FORBIDDEN);
                return;
            }
            httpError(next, req, 400, workflow.message);
            return;
        }

        httpResponse(res, req, 200, SUCCESS_MESSAGES.WORKFLOW_SAVED, workflow);
    } catch (error) {
        httpError(next, req, 500, ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
    }
}


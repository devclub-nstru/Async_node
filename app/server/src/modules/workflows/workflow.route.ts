import router from "express";
import { createWorkflowController, deleteWorkflowController, getUserWorkflowsController, getWorkflowController } from "./workflow.controller.ts";

export const workflowRouter = router.Router();

/**
 * @openapi
 * /api/v1/workflows/workflows:
 *   get:
 *     tags:
 *       - Workflows
 *     summary: Get all workflows for the authenticated user
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Workflows retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Workflow'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
workflowRouter.get("/workflows", getUserWorkflowsController);

/**
 * @openapi
 * /api/v1/workflows/workflows/{workflowId}:
 *   get:
 *     tags:
 *       - Workflows
 *     summary: Get a single workflow by ID
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: workflowId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Numeric ID of the workflow
 *     responses:
 *       200:
 *         description: Workflow retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Workflow'
 *       400:
 *         description: Invalid workflow ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Workflow not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
workflowRouter.get("/workflows/:workflowId", getWorkflowController);

/**
 * @openapi
 * /api/v1/workflows/workflows:
 *   post:
 *     tags:
 *       - Workflows
 *     summary: Create a new workflow
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateWorkflowRequest'
 *     responses:
 *       201:
 *         description: Workflow created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Workflow'
 *       400:
 *         description: Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
workflowRouter.post("/workflows", createWorkflowController);

/**
 * @openapi
 * /api/v1/workflows/workflows/{workflowId}:
 *   delete:
 *     tags:
 *       - Workflows
 *     summary: Delete a workflow by ID
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: workflowId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Numeric ID of the workflow
 *     responses:
 *       200:
 *         description: Workflow deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Workflow'
 *       400:
 *         description: Invalid workflow ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Workflow not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
workflowRouter.delete("/workflows/:workflowId", deleteWorkflowController);

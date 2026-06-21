import type { WorkflowNode } from "../types/types.ts";
import { makeHttpRequest } from "../integrations/http/request.ts";

export async function executeHttpNode(
  node: WorkflowNode
) {
  return makeHttpRequest({
    url: node.data.url,
    method: node.data.method,
    headers: node.data.headers,
    body: node.data.body
  });
}
import type { WorkflowNode } from "../types/types.ts";
import { runGroq } from "../integrations/ai/groq.ts";

export async function executeGroqNode(
  node: WorkflowNode,
  credentials: {
    apiKey: string;
  }
) {
  return runGroq({
    credentials,
    prompt: node.data.prompt,
    model: node.data.model
  });
}
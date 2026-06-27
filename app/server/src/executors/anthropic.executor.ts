import type { WorkflowNode } from "../types/types.ts";
import { runAnthropic } from "../integrations/ai/anthropic.ts";

export async function executeAnthropicNode(
  node: WorkflowNode,
  credentials: {
    apiKey: string;
  }
) {
  return runAnthropic({
    credentials,
    prompt: node.data.prompt,
    model: node.data.model
  });
}
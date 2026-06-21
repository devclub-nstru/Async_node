import type { WorkflowNode } from "../types/types.ts";
import { sendSlackMessage } from "../integrations/communications/slack.ts";

export async function executeSlackNode(
  node: WorkflowNode,
  credentials: {
    webhookUrl: string;
  }
) {
  return sendSlackMessage({
    credentials,
    text: node.data.text
  });
}
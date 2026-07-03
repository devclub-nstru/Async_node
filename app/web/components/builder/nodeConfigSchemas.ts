import type { BuilderNodeCategory } from "./nodeTypes"

export type FieldType = "text" | "textarea" | "select" | "password" | "number"

export interface ConfigField {
  key: string
  label: string
  type: FieldType
  placeholder?: string
  options?: { value: string; label: string }[]
  required?: boolean
}

export const AI_PROVIDERS = [
  {
    value: "anthropic",
    label: "Anthropic",
    models: ["claude-opus-4-8", "claude-sonnet-5", "claude-haiku-4-5-20251001"],
  },
  {
    value: "openai",
    label: "OpenAI",
    models: ["gpt-5.1", "gpt-5.1-mini", "gpt-5.1-nano"],
  },
  {
    value: "groq",
    label: "Groq",
    models: ["llama-3.3-70b-versatile", "llama-3.1-8b-instant", "mixtral-8x7b-32768"],
  },
] as const

export type AIProviderValue = (typeof AI_PROVIDERS)[number]["value"]

// Fields shared by every AI provider, once a provider is chosen.
const AI_COMMON_FIELDS: ConfigField[] = [
  { key: "apiKey", label: "API Key", type: "password", placeholder: "sk-...", required: true },
  { key: "prompt", label: "Prompt", type: "textarea", placeholder: "Enter the prompt to send", required: true },
]

export function getAIModelField(provider: AIProviderValue | undefined): ConfigField {
  const models = AI_PROVIDERS.find((p) => p.value === provider)?.models ?? []
  return {
    key: "model",
    label: "Model",
    type: "select",
    required: true,
    options: models.map((m) => ({ value: m, label: m })),
  }
}

export function getAIProviderFields(provider: AIProviderValue | undefined): ConfigField[] {
  if (!provider) return []
  return [getAIModelField(provider), ...AI_COMMON_FIELDS]
}

const HTTP_METHOD_OPTIONS = [
  { value: "GET", label: "GET" },
  { value: "POST", label: "POST" },
  { value: "PUT", label: "PUT" },
  { value: "PATCH", label: "PATCH" },
  { value: "DELETE", label: "DELETE" },
]

export const NODE_CONFIG_FIELDS: Record<Exclude<BuilderNodeCategory, "ai" | "trigger">, ConfigField[]> = {
  http: [
    { key: "url", label: "URL", type: "text", placeholder: "https://api.example.com/endpoint", required: true },
    { key: "method", label: "Method", type: "select", options: HTTP_METHOD_OPTIONS, required: true },
    { key: "headers", label: "Headers (JSON)", type: "textarea", placeholder: '{ "Content-Type": "application/json" }' },
    { key: "body", label: "Body (JSON)", type: "textarea", placeholder: '{ "key": "value" }' },
  ],
  email: [
    { key: "host", label: "SMTP Host", type: "text", placeholder: "smtp.example.com", required: true },
    { key: "port", label: "SMTP Port", type: "number", placeholder: "587", required: true },
    { key: "username", label: "Username", type: "text", required: true },
    { key: "password", label: "Password", type: "password", required: true },
    { key: "to", label: "To", type: "text", placeholder: "recipient@example.com", required: true },
    { key: "subject", label: "Subject", type: "text", required: true },
    { key: "html", label: "Body (HTML)", type: "textarea", required: true },
  ],
  slack: [
    { key: "webhookUrl", label: "Webhook URL", type: "text", placeholder: "https://hooks.slack.com/services/...", required: true },
    { key: "text", label: "Message", type: "textarea", required: true },
  ],
}

export const TRIGGER_CONFIG_FIELDS: ConfigField[] = [
  {
    key: "type",
    label: "Trigger Type",
    type: "select",
    required: true,
    options: [
      { value: "manual", label: "Manual" },
      { value: "webhook", label: "Webhook" },
      { value: "cron", label: "Schedule (Cron)" },
    ],
  },
]

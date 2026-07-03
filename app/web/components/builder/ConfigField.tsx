"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { ConfigField as ConfigFieldDef } from "./nodeConfigSchemas"

interface ConfigFieldProps {
  field: ConfigFieldDef
  value: string
  onChange: (value: string) => void
}

export default function ConfigFieldInput({ field, value, onChange }: ConfigFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={field.key} className="text-[12px] text-white/60">
        {field.label}
        {field.required && <span className="text-white/30">*</span>}
      </Label>

      {field.type === "textarea" ? (
        <Textarea
          id={field.key}
          value={value}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="min-h-20 border-white/[0.08] bg-white/[0.02] text-[13px] text-[#f0eee9] placeholder:text-white/25"
        />
      ) : field.type === "select" ? (
        <select
          id={field.key}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-8 w-full rounded-lg border border-white/[0.08] bg-white/[0.02] px-2.5 text-[13px] text-[#f0eee9] outline-none focus-visible:border-white/20"
        >
          <option value="" disabled>
            Select {field.label.toLowerCase()}
          </option>
          {field.options?.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-[#111114]">
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <Input
          id={field.key}
          type={field.type === "password" ? "password" : field.type === "number" ? "number" : "text"}
          value={value}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="border-white/[0.08] bg-white/[0.02] text-[13px] text-[#f0eee9] placeholder:text-white/25"
        />
      )}
    </div>
  )
}

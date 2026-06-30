"use client"

import { useState } from "react"
import Link from "next/link"
import { Eye, EyeOff, Shield, Mail } from "lucide-react"
import { cn } from "@/lib/utils"

const inputCls = cn(
  "w-full rounded px-4 py-3 text-sm text-[#f0eee9]",
  "placeholder:text-white/25 outline-none",
  "bg-white/5 border border-white/[0.06]",
  "transition-[border-color,box-shadow]",
  "focus:border-amber-600 focus:ring-[3px] focus:ring-amber-600/20",
)

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <form>
      {/* email */}
      <div className="mb-4">
        <label
          htmlFor="email"
          className="mb-1.5 block text-[12px] font-medium uppercase tracking-[0.04em] text-zinc-400"
        >
          Email Address
        </label>
        <input
          id="email"
          type="email"
          placeholder="you@company.com"
          autoComplete="email"
          className={inputCls}
        />
      </div>

      {/* password */}
      <div className="mb-6">
        <label
          htmlFor="password"
          className="mb-1.5 block text-[12px] font-medium uppercase tracking-[0.04em] text-zinc-400"
        >
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••••••"
            autoComplete="current-password"
            className={cn(inputCls, "pr-11 placeholder:tracking-[0.2em]")}
          />
          <button
            type="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword((p) => !p)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/35 hover:text-white/60 transition-colors"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      {/* remember / forgot */}
      <div className="mb-6 flex items-center justify-between">
        <Link href="/forgot-password" className="text-[13px] text-amber-600 hover:underline">
          Forgot password?
        </Link>
      </div>

      {/* primary CTA */}
      <button type="submit" className="signin-cta mb-4">
        Continue
      </button>

     
    </form>
  )
}

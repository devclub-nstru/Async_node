"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Workflow, Menu, X } from "lucide-react";

const NAV_LINKS = [
  "Product",
  "Integrations",
  "Docs",
  "Pricing",
  "Blog",
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);

    window.addEventListener("scroll", fn);

    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-x-0 top-0 z-50 pt-4"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div
          className="
            relative
            flex
            items-center
            justify-between
            h-[72px]
            rounded-2xl
            border
            border-white/[0.06]
            transition-all
            duration-300
          "
          style={{
            background: scrolled
              ? "rgba(15,17,21,0.88)"
              : "rgba(15,17,21,0.72)",
            backdropFilter: "blur(24px)",
          }}
        >
          {/* Glow */}

          <div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(217,119,6,0.08) 50%, transparent 100%)",
            }}
          />

          {/* Left */}

          <div className="relative z-10 flex items-center gap-3 pl-6">
            <div className="flex flex-col gap-[3px]">
              <div className="w-5 h-[2px] bg-amber-600 rounded-full" />
              <div className="w-3.5 h-[2px] bg-amber-500 rounded-full" />
              <div className="w-2 h-[2px] bg-amber-400 rounded-full" />
            </div>

            <span
              className="text-zinc-100 font-semibold tracking-tight"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "20px",
              }}
            >
              AsyncNode
            </span>
          </div>

          {/* Center */}

          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link}
                href="#"
                className="
                  px-4
                  py-2
                  rounded-lg
                  text-base
                  font-medium
                  text-zinc-500
                  hover:text-zinc-200
                  transition-all
                "
              >
                {link}
              </a>
            ))}
          </div>

          {/* Right */}

          <div className="hidden md:flex items-center gap-3 pr-6">
            <a
              href="#"
              className="
                px-4
                py-2
                rounded-lg
                text-base
                font-medium
                text-zinc-500
                hover:text-zinc-200
                hover:bg-white/[0.03]
                transition-colors
              "
            >
              Sign in
            </a>

            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href="#"
              className="
                relative
                flex
                items-center
                gap-3
                h-[40px]
                px-5
                rounded-full
                overflow-hidden
                group
              "
              style={{
                border: "1px solid rgba(217,119,6,0.35)",
                background:
                  "linear-gradient(180deg, rgba(217,119,6,0.08) 0%, rgba(217,119,6,0.04) 100%)",
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.04), 0 0 40px rgba(217,119,6,0.08)",
              }}
            >
              {/* Glow Layer */}

              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle at center, rgba(217,119,6,0.18), transparent 70%)",
                  opacity: 0.8,
                }}
              />

              {/* Border Glow */}

              <div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  boxShadow:
                    "inset 0 0 0 1px rgba(217,119,6,0.18), 0 0 30px rgba(217,119,6,0.15)",
                }}
              />

              <span
                className="relative z-10"
                style={{
                  color: "#D97706",
                  fontSize: "15px",
                  fontWeight: 600,
                  letterSpacing: "-0.02em",
                  fontFamily: "var(--font-display)",
                }}
              >
                Get Started
              </span>

              <span
                className="
                  relative
                  z-10
                  transition-transform
                  duration-300
                  group-hover:translate-x-1
                "
                style={{
                  color: "#D97706",
                  fontSize: "20px",
                  lineHeight: 1,
                }}
              >
                →
              </span>
            </motion.a>
          </div>

          {/* Mobile */}

          <button
            className="md:hidden pr-6 text-zinc-400"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
    </motion.nav>
  );
}
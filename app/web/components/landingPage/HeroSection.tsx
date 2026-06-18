"use client";

import { useState, useEffect, use } from "react";
import { motion } from "motion/react";
import { ArrowRight, Play, ChevronRight } from "lucide-react";

/* ─── Layout constants ───────────────────────────────────────────────────── */
const NW = 148, NH = 66;

/* node colors — all amber/graphite, no purple/cyan */
const NODES = [
  { id: "webhook",   label: "HTTP Webhook",   type: "TRIGGER",   x: 20,  y: 197, color: "#D97706", status: "done"    },
  { id: "auth",      label: "Auth Guard",     type: "VALIDATOR", x: 222, y: 114, color: "#A1A1AA", status: "done"    },
  { id: "claude",    label: "AI Processor",   type: "AI AGENT",  x: 432, y: 160, color: "#F59E0B", status: "running" },
  { id: "router",    label: "Route Logic",    type: "CONDITION", x: 630, y: 84,  color: "#71717A", status: "idle"    },
  { id: "pg",        label: "PostgreSQL",     type: "DATABASE",  x: 826, y: 14,  color: "#52525B", status: "idle"    },
  { id: "transform", label: "Data Transform", type: "PROCESSOR", x: 432, y: 298, color: "#D97706", status: "done"    },
  { id: "slack",     label: "Slack Notify",   type: "ACTION",    x: 826, y: 174, color: "#FCD34D", status: "idle"    },
  { id: "done",      label: "Workflow Done",  type: "TERMINAL",  x: 826, y: 330, color: "#22C55E", status: "idle"    },
] as const;

const op = (n: typeof NODES[number]) => ({ x: n.x + NW,  y: n.y + NH / 2 });
const ip = (n: typeof NODES[number]) => ({ x: n.x,       y: n.y + NH / 2 });
const nd = (id: string) => NODES.find(n => n.id === id)!;

const mkPath = (from: string, to: string) => {
  const s = op(nd(from)), e = ip(nd(to)), mx = (s.x + e.x) / 2;
  return `M ${s.x} ${s.y} C ${mx} ${s.y} ${mx} ${e.y} ${e.x} ${e.y}`;
};

const EDGES = [
  { id: "e1", path: mkPath("webhook",   "auth"),      active: true  },
  { id: "e2", path: mkPath("auth",      "claude"),    active: true  },
  { id: "e3", path: mkPath("claude",    "router"),    active: true  },
  { id: "e4", path: mkPath("router",    "pg"),        active: false },
  { id: "e5", path: mkPath("router",    "slack"),     active: false },
  { id: "e6", path: mkPath("webhook",   "transform"), active: false },
  { id: "e7", path: mkPath("transform", "done"),      active: false },
];

/* ─── SVG Node ────────────────────────────────────────────────────────────── */
function SvgNode({ id, label, type, x, y, color, status }: typeof NODES[number]) {
  const isRunning = status === "running";
  const isDone    = status === "done";
  return (
    <g>
      {isRunning && (
        <rect x={x - 3} y={y - 3} width={NW + 6} height={NH + 6} rx={10}
          fill="none" stroke={color} strokeWidth="1" opacity="0.28">
          <animate attributeName="opacity" values="0.28;0.08;0.28" dur="2s" repeatCount="indefinite" />
        </rect>
      )}
      <rect x={x} y={y} width={NW} height={NH} rx={8}
        fill="rgba(255,255,255,0.03)"
        stroke={isRunning ? color : "rgba(255,255,255,0.07)"}
        strokeWidth={isRunning ? 1.5 : 1}
      />
      {/* Top accent bar */}
      <rect x={x + 1} y={y} width={NW - 2} height={2.5} rx={1.5} fill={color} />
      {/* Icon pill */}
      <rect x={x + 8} y={y + 15} width={26} height={26} rx={6} fill={`${color}18`} />
      <text x={x + 21} y={y + 33} textAnchor="middle"
        fontSize="10" fill={color} fontFamily="JetBrains Mono, monospace" fontWeight="600">
        {type[0]}
      </text>
      {/* Label */}
      <text x={x + 42} y={y + 29} fontSize="10" fill="rgba(255,255,255,0.75)"
        fontFamily="var(--font-body)" fontWeight="500">{label}
      </text>
      {/* Type */}
      <text x={x + 42} y={y + 44} fontSize="7.5" fill="rgba(255,255,255,0.2)"
        fontFamily="JetBrains Mono, monospace" letterSpacing="0.08em">{type}
      </text>
      {/* Status dot */}
      <circle cx={x + NW - 12} cy={y + 14} r={4}
        fill={isDone ? "#22C55E" : isRunning ? color : "#27272A"}>
        {isRunning && <animate attributeName="opacity" values="1;0.2;1" dur="1.2s" repeatCount="indefinite" />}
      </circle>
      {/* Ports */}
      {id !== "webhook" && (
        <circle cx={x} cy={y + NH / 2} r={4} fill="#111113" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
      )}
      <circle cx={x + NW} cy={y + NH / 2} r={4} fill="#111113" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
    </g>
  );
}

/* ─── Section ─────────────────────────────────────────────────────────────── */
export function HeroSection() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 1800);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      className="relative min-h-screen flex flex-col overflow-hidden"
      style={{ background: "transparent" }}
    >
      {/* Amber core orb */}
      <div style={{
        position: 'absolute', top: '10%', left: '50%',
        transform: 'translateX(-50%)',
        width: 600, height: 400,
        background: 'radial-gradient(ellipse, rgba(217,119,6,0.14) 0%, transparent 70%)',
        filter: 'blur(60px)',
        pointerEvents: 'none',
      }} />

      {/* Cool edge orb */}
      <div style={{
        position: 'absolute', bottom: 0, right: 0,
        width: 400, height: 400,
        background: 'radial-gradient(ellipse, rgba(255,255,255,0.02) 0%, transparent 70%)',
        filter: 'blur(80px)',
        pointerEvents: 'none',
      }} />

      {/* ── Headline ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-32 lg:pt-36 pb-10 w-full">
        <motion.div
          initial={{ opacity: 0, y: 36, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center text-center max-w-4xl mx-auto"
        >
          {/* Status pill */}
          {/* <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '5px 14px',
            borderRadius: 40,
            background: 'rgba(217,119,6,0.07)',
            border: '1px solid rgba(217,119,6,0.18)',
            marginBottom: 32,
          }}> */}
            {/* Pulsing dot */}
            {/* <motion.div
              animate={{ scale: [1, 1.5, 1], opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              style={{ width: 5, height: 5, borderRadius: '50%', background: '#D97706' }}
            />
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem',
              letterSpacing: '0.1em',
              color: 'rgba(217,119,6,0.8)',
              textTransform: 'uppercase',
            }}>
              Visual Workflow Automation for AI Teams
            </span>
          </div> */}

          {/* H1 */}
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: "clamp(3rem, 10vw, 8rem)",
            fontWeight: 800,
            lineHeight: 1.0,
            letterSpacing: '-0.04em',
            color: '#F0EEE9',
            marginBottom: 28,
          }}>
            Build Workflows<br/>
            {/* Outlined word */}
            <span style={{
              WebkitTextStroke: '1.5px rgba(217,119,6,0.5)',
              color: 'transparent',
              display: 'block',
            }}>
              That Think.
            </span>
          </h1>

          <p style={{
            fontFamily: 'var(--font-body)',
            fontWeight: 300,
            fontSize: 'clamp(14px, 4vw, 18px)',
            lineHeight: 1.75,
            color: 'rgba(255,255,255,0.42)',
            maxWidth: 480,
            marginBottom: 44,
          }}>
            Orchestrate AI agents, connect any API, and automate
            production pipelines — without writing infrastructure code.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 mb-11 w-full max-w-md sm:max-w-fit mx-auto">
            <motion.a
              className="w-full sm:w-auto justify-center"
              whileHover={{
                boxShadow:
                  "0 0 60px rgba(217,119,6,0.5), 0 0 120px rgba(217,119,6,0.2)",
                scale: 1.015,
              }}
              whileTap={{ scale: 0.97 }}
              href="#"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
                padding: "16px 36px",
                borderRadius: 4,
                background: "#D97706",
                color: "#060608",
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "0.92rem",
                letterSpacing: "-0.01em",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Animated shine sweep */}
              <motion.div
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)",
                  pointerEvents: "none",
                }}
              />
              Start Building Free
              <span style={{ fontSize: 16 }}>→</span>
            </motion.a>

            <motion.a
              className="w-full sm:w-auto justify-center"
              whileHover={{ color: "rgba(255,255,255,0.7)" }}
              href="#"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                padding: "16px 28px",
                color: "rgba(255,255,255,0.28)",
                fontFamily: "var(--font-body)",
                fontWeight: 400,
                fontSize: "0.88rem",
                borderBottom: "1px solid rgba(255,255,255,0.1)",
                transition: "color 0.25s ease",
              }}
            >
              Watch Demo
            </motion.a>
          </div>

          {/* Mini stats */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
            {[["50K+","Automations"],["99.9%","Uptime"],["120+","Integrations"]].map(([v,l]) => (
              <div key={l} className="text-center">
                <div style={{ fontFamily:"var(--font-display)", color:"#FAFAFA", fontSize:"clamp(0.95rem, 2vw, 1.05rem)", fontWeight:800, lineHeight:1 }}>{v}</div>
                <div style={{ color:"#3F3F46", fontFamily:"var(--font-mono)", fontSize:"0.6rem", letterSpacing:"0.1em", marginTop:3 }}>{l.toUpperCase()}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Canvas ── */}
      <motion.div
        initial={{ opacity: 0, y: 36, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-20 w-full"
      >
        <div
          className="relative overflow-hidden"
          style={{
            background: "transparent",
            border: "none",
            boxShadow: "none",
          }}
        >
          {/* Chrome */}
          <div
            className="flex items-center justify-between px-5 py-3"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                {["#FF5F56","#FFBD2E","#27C93F"].map(c => (
                  <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c, opacity: 0.72 }} />
                ))}
              </div>
              <span className="ml-3" style={{ color:"#3F3F46", fontFamily:"var(--font-mono)", fontSize:"0.68rem" }}>
                customer-onboarding.flow
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md"
                style={{ background:"rgba(217,119,6,0.08)", border:"1px solid rgba(217,119,6,0.18)" }}
              >
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background:"#D97706" }} />
                <span style={{ color:"#D97706", fontFamily:"var(--font-mono)", fontSize:"0.62rem" }}>LIVE</span>
              </div>
              <ChevronRight size={13} style={{ color:"#3F3F46" }} />
            </div>
          </div>

          {/* SVG canvas */}
          <div
            className="relative overflow-hidden"
            style={{
              height: "clamp(280px, 52vw, 470px)",
            }}
          >
            <svg
              viewBox="0 0 1040 460"
              preserveAspectRatio="xMidYMid meet"
              className="absolute inset-0 w-full h-full"
              style={{ zIndex: 2 }}
            >
              <rect
                x={0} y={0}
                width="100%" height="100%"
                fill="rgba(255,255,255,0.02)"
                rx={8}
              />
              <defs>
                <filter id="amberGlow" x="-200%" y="-200%" width="500%" height="500%">
                  <feGaussianBlur stdDeviation="3" result="b" />
                  <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>

              {/* Edges */}
              {EDGES.map(e => (
                <path key={e.id} id={e.id} d={e.path}
                  fill="none"
                  stroke={e.active ? "rgba(217,119,6,0.25)" : "rgba(255,255,255,0.05)"}
                  strokeWidth={e.active ? 1.5 : 1}
                />
              ))}

              {/* Amber particles on active edges */}
              {EDGES.filter(e => e.active).map(e => (
                <g key={e.id + "-p"} filter="url(#amberGlow)">
                  {[0, 0.45].map(offset => (
                    <circle key={offset} r="3.5" fill="#D97706">
                      <animateMotion dur="1.8s" repeatCount="indefinite" begin={`${offset * 1.8}s`} calcMode="linear">
                        <mpath href={`#${e.id}`} />
                      </animateMotion>
                    </circle>
                  ))}
                </g>
              ))}

              {NODES.map(n => <SvgNode key={n.id} {...n} />)}
            </svg>

            {/* Floating: Metrics */}
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="hidden md:block absolute rounded-xl p-3.5"
              style={{
                top: 14, right: 14, minWidth: 152, zIndex: 10,
                background: "rgba(15,15,16,0.94)",
                border: "1px solid rgba(255,255,255,0.08)",
                backdropFilter: "blur(12px)",
                boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
              }}
            >
              <div style={{ color:"#3F3F46", fontFamily:"var(--font-mono)", fontSize:"0.58rem", letterSpacing:"0.08em", marginBottom:8 }}>LIVE METRICS</div>
              {[
                { k:"Runs today",   v:(12847 + tick * 3).toLocaleString(), c:"#D97706" },
                { k:"Success rate", v:"99.8%",                               c:"#22C55E" },
                { k:"Avg latency",  v:"138ms",                               c:"#A1A1AA" },
              ].map(m => (
                <div key={m.k} className="flex items-center justify-between mb-1">
                  <span style={{ color:"#52525B", fontFamily:"var(--font-mono)", fontSize:"0.6rem" }}>{m.k}</span>
                  <span style={{ color:m.c, fontFamily:"var(--font-mono)", fontSize:"0.68rem", fontWeight:600 }}>{m.v}</span>
                </div>
              ))}
            </motion.div>

            {/* Floating: Inspector */}
            <motion.div
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
              className="hidden md:block absolute rounded-xl p-3.5"
              style={{
                bottom: 48, left: 14, minWidth: 168, zIndex: 10,
                background: "rgba(15,15,16,0.94)",
                border: "1px solid rgba(217,119,6,0.18)",
                backdropFilter: "blur(12px)",
                boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
              }}
            >
              <div style={{ color:"#3F3F46", fontFamily:"var(--font-mono)", fontSize:"0.58rem", letterSpacing:"0.08em", marginBottom:6 }}>NODE INSPECTOR</div>
              <div style={{ color:"#FAFAFA", fontFamily:"var(--font-body)", fontSize:"0.76rem", fontWeight:500, marginBottom:4 }}>AI Processor</div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {["model:gpt-4o","temp:0.3","tools:6"].map(t => (
                  <span key={t} className="px-1.5 py-0.5 rounded-md"
                    style={{ background:"rgba(217,119,6,0.1)", color:"#D97706", fontFamily:"var(--font-mono)", fontSize:"0.58rem" }}>
                    {t}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-1.5 mt-2.5">
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background:"#D97706" }} />
                <span style={{ color:"#D97706", fontFamily:"var(--font-mono)", fontSize:"0.6rem" }}>Processing… 1.4s</span>
              </div>
            </motion.div>

            {/* Minimap */}
            <div
              className="hidden md:block absolute rounded-lg overflow-hidden"
              style={{
                bottom: 14, right: 14, width: 108, height: 60, zIndex: 10,
                background: "rgba(11,11,12,0.94)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <svg viewBox="0 0 1040 460" className="w-full h-full" style={{ opacity: 0.65 }}>
                {NODES.map(n => (
                  <rect key={n.id} x={n.x} y={n.y} width={NW} height={NH} rx={4}
                    fill={n.color} opacity={0.22} />
                ))}
                {EDGES.map(e => (
                  <path key={e.id} d={e.path} fill="none"
                    stroke={e.active ? "rgba(217,119,6,0.5)" : "rgba(255,255,255,0.05)"}
                    strokeWidth={e.active ? 3 : 1.5} />
                ))}
              </svg>
              <div className="absolute bottom-1 left-2"
                style={{ color:"#27272A", fontFamily:"var(--font-mono)", fontSize:"0.48rem", letterSpacing:"0.06em" }}>
                MINIMAP
              </div>
            </div>
          </div>

          {/* Footer bar */}
          <div
            className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-3"
            style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
          >
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5">
              {[["8 nodes","⬡"],["7 edges","→"],["2 agents","◈"],["3 active","●"]].map(([l,i]) => (
                <span key={l} style={{ color:"#3F3F46", fontFamily:"var(--font-mono)", fontSize:"0.62rem" }}>{i} {l}</span>
              ))}
            </div>
            <span style={{ color:"#22C55E", fontFamily:"var(--font-mono)", fontSize:"0.62rem" }}>● RUNNING</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
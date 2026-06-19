"use client";

import { motion } from "motion/react";
import { ArrowRight, Play, Workflow, Shield, Clock } from "lucide-react";

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden py-32 sm:py-40 bg-[rgba(217,119,6,0.04)] border-t border-[rgba(217,119,6,0.1)] border-b border-[rgba(217,119,6,0.06)]">

      <div
        className="absolute inset-0 bg-[length:80px_80px] bg-[image:linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] rotate-[3deg] scale-110
        "
      />
      <div className="absolute top-1/2 left-1/2 w-[700px] h-[500px] -translate-x-1/2 -translate-y-1/2 pointer-events-none blur-[40px] bg-[radial-gradient(ellipse,rgba(217,119,6,0.1)_0%,transparent_65%)]" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity:0, y:36, scale: 0.97 }}
          whileInView={{ opacity:1, y:0, scale: 1 }}
          viewport={{ once:true }}
          transition={{ duration:0.8, ease:[0.22,1,0.36,1] }}
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-10 bg-[rgba(217,119,6,0.08)] border border-[rgba(217,119,6,0.2)]">
            <Workflow size={11} className="text-[#D97706]" />
            <span className="font-mono text-[0.68rem] tracking-[0.07em] text-[#D97706]">
              DEPLOY YOUR FIRST WORKFLOW IN UNDER 5 MINUTES
            </span>
          </div>

          <h2
            className="font-display text-[clamp(40px,7vw,88px)] font-extrabold leading-[1.02] tracking-[-0.04em] text-[#F0EEE9] mb-6"
          >
            Ship faster.
            <br />
            <span className="block text-transparent [-webkit-text-stroke:1.5px_rgba(217,119,6,0.5)]">
              Break less.
            </span>
          </h2>

          <p className="max-w-[500px] mx-auto mb-12 font-body text-[1.05rem] leading-[1.72] text-[rgba(255,255,255,0.38)]">
            Create workflows, orchestrate AI agents, and automate business
            operations from one unified platform.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <motion.a
              whileHover={{
                boxShadow:
                  "0 0 60px rgba(217,119,6,0.5), 0 0 120px rgba(217,119,6,0.2)",
                scale: 1.015,
              }}
              whileTap={{ scale: 0.97 }}
              href="#"
              className="relative overflow-hidden inline-flex items-center gap-3 px-9 py-4 rounded text-[#060608] bg-[#D97706] font-display font-bold text-[0.92rem] tracking-[-0.01em]"
            >
              <motion.div
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="absolute inset-0 pointer-events-none bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.25),transparent)]"
              />
              Start Building Free
              <span className="text-base">→</span>
            </motion.a>
            <motion.a
              whileHover={{ color: "rgba(255,255,255,0.7)" }}
              href="#"
              className="inline-flex items-center gap-2 px-7 py-4 font-body text-[0.88rem] font-normal text-[rgba(255,255,255,0.28)] border-b border-[rgba(255,255,255,0.1)] transition-colors duration-300"
            >
              Watch Demo
            </motion.a>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {[
              { icon:<Shield size={11}/>,   label:"SOC 2 Type II"           },
              { icon:<Workflow size={11}/>,  label:"No credit card required" },
              { icon:<Clock size={11}/>,     label:"Deploy in minutes"        },
              { icon:<Shield size={11}/>,   label:"99.9% SLA"                },
              { icon:<Workflow size={11}/>,  label:"Free tier forever"        },
            ].map((p,i)=>(
              <div
                key={i}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)]"
              >
                <span className="text-[rgba(34,197,94,0.7)]">{p.icon}</span>
                <span className="font-body text-[0.78rem] text-[rgba(255,255,255,0.22)]">{p.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

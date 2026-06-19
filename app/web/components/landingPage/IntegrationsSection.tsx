"use client";

import { motion } from "motion/react";

const integrations = [
  {
    name: "Slack",
    image:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/slack/slack-original.svg",
  },
  {
    name: "OpenAI",
    image:
      "https://static.freepnglogo.com/images/all_img/1702059841openai-icon-png.png",
  },
  {
    name: "Groq",
    image:
      "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/grok-ai-icon.svg",
  },
  {
    name: "Gmail",
    image:
      "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/gmail-icon.png",
  },
];

export function IntegrationsSection() {
  return (
    <section className="relative py-36 overflow-hidden">
      {/* Amber radial background — no Tailwind equivalent */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(circle at center, rgba(217,119,6,0.18) 0%, transparent 60%)" }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2>
            <div className="m-0 text-[clamp(22px,3.2vw,38px)] font-light text-white/55 tracking-[-0.01em] leading-[1.3] font-display">
              Plug AI into your own data &
            </div>
            <div className="mt-0.5 text-[clamp(28px,4vw,52px)] font-bold text-[#FAFAFA] tracking-[-0.02em] leading-[1.2] font-display">
              connect the tools you already use
            </div>
          </h2>

          <p className="mt-3.5 text-[18px] font-medium text-white/35 max-w-140 mx-auto leading-[1.6] tracking-[0.01em] font-body">
            Use pre-built nodes for common apps. Custom API
            connections for everything else.
          </p>
        </motion.div>

        {/* Integration Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {integrations.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group"
            >
              <div className="h-55 rounded-[28px] border border-white/6 flex flex-col items-center justify-center relative overflow-hidden bg-white/4 backdrop-blur-xl">
                {/* Glow — radial-gradient, no Tailwind equivalent */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: "radial-gradient(circle at center, rgba(217,119,6,0.12), transparent 70%)" }}
                />

                <img
                  src={item.image}
                  alt={item.name}
                  className="h-14 w-auto object-contain relative z-10 mb-6 transition-transform duration-300 group-hover:scale-110"
                />

                <h3 className="relative z-10 text-[#FAFAFA] text-[18px] font-bold font-body">
                  {item.name}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex justify-center mt-16">
          <motion.a
            href="#"
            whileHover={{ y: -2, scale: 1.02, boxShadow: "0 8px 40px rgba(217,119,6,0.35)" }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 px-5.5 py-3 rounded-full text-[#060608] font-body font-extrabold text-[0.85rem] tracking-[0.01em] no-underline shadow-[0px_4px_24px_rgba(217,119,6,0.2)]"
            style={{ background: "linear-gradient(135deg, rgb(217,119,6) 0%, rgb(252,211,77) 100%)" }}
          >
            Browse all integrations
          </motion.a>
        </div>
      </div>
    </section>
  );
}

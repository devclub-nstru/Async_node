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

const logos = integrations.map((item) => (
  <div
    key={item.name}
    className="
      flex-shrink-0
      w-[100px]
      h-[100px]
      rounded-2xl
      border
      flex
      items-center
      justify-center
      transition-all
      duration-300
      hover:border-white/15
    "
    style={{
      background: "rgba(255, 255, 255, 0.04)",
      borderColor: "rgba(255,255,255,0.06)",
      backdropFilter: "blur(24px)",
    }}
  >
    <img
      src={item.image}
      alt={item.name}
      className="
        h-10
        w-auto
        object-contain
        opacity-80
        hover:opacity-100
        transition-opacity
      "
    />
  </div>
));

export function IntegrationsSection() {
  return (
    <section className="relative py-36 overflow-hidden">
      {/* Grid */}

      {/* <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
        }}
      /> */}

      {/* Orange glow */}

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at center, rgba(217,119,6,0.18) 0%, transparent 60%)",
        }}
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
            <div
              style={{
                margin: "0",
                fontSize: "clamp(22px, 3.2vw, 38px)",
                fontWeight: 300,
                color: "rgba(255,255,255,0.55)",
                letterSpacing: "-0.01em",
                lineHeight: 1.3,
                fontFamily: "var(--font-display)",
              }}
            >
              Plug AI into your own data &
            </div>

            <div
              style={{
                margin: "2px 0 0",
                fontSize: "clamp(28px, 4vw, 52px)",
                fontWeight: 700,
                color: "#FAFAFA",
                letterSpacing: "-0.02em",
                lineHeight: 1.2,
                fontFamily: "var(--font-display)",
              }}
            >
              connect the tools you already use
            </div>
          </h2>

          <p
            style={{
              marginTop: "14px",
              fontSize: "18px",
              fontWeight: 500,
              color: "rgba(255,255,255,0.35)",
              maxWidth: "560px",
              marginInline: "auto",
              lineHeight: 1.6,
              letterSpacing: "0.01em",
              fontFamily: "var(--font-body)",
            }}
          >
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
              whileHover={{
                y: -8,
                scale: 1.02,
              }}
              className="group"
            >
              <div
                className="
                  h-[220px]
                  rounded-[28px]
                  border
                  flex
                  flex-col
                  items-center
                  justify-center
                  relative
                  overflow-hidden
                "
                style={{
                  background: "rgba(255,255,255,0.04)",
                  borderColor: "rgba(255,255,255,0.06)",
                  backdropFilter: "blur(24px)",
                }}
              >
                {/* Glow */}

                <div
                  className="
                    absolute
                    inset-0
                    opacity-0
                    group-hover:opacity-100
                    transition-opacity
                    duration-300
                  "
                  style={{
                    background:
                      "radial-gradient(circle at center, rgba(217,119,6,0.12), transparent 70%)",
                  }}
                />

                <img
                  src={item.image}
                  alt={item.name}
                  className="
                    h-14
                    w-auto
                    object-contain
                    relative
                    z-10
                    mb-6
                    transition-transform
                    duration-300
                    group-hover:scale-110
                  "
                />

                <h3
                  className="relative z-10"
                  style={{
                    color: "#FAFAFA",
                    fontSize: "18px",
                    fontWeight: 700,
                    fontFamily: "var(--font-body)",
                  }}
                >
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
            whileHover={{
              y: -2,
              scale: 1.02,
              boxShadow:
                "0 8px 40px rgba(217,119,6,0.35)",
            }}
            whileTap={{ scale: 0.98 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 22px",
              borderRadius: "40px",
              background:
                "linear-gradient(135deg, rgb(217, 119, 6) 0%, rgb(252, 211, 77) 100%)",
              border: "none",
              color: "rgb(6, 6, 8)",
              fontFamily: "var(--font-body)",
              fontWeight: 800,
              fontSize: "0.85rem",
              letterSpacing: "0.01em",
              textDecoration: "none",
              transition: "0.25s",
              boxShadow:
                "0px 4px 24px rgba(217,119,6,0.2)",
            }}
          >
            Browse all integrations
          </motion.a>
        </div>
      </div>
    </section>
  );
}
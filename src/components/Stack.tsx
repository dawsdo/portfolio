"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

const ROW1 = ["Python", "TypeScript", "Go", "OCaml", "C++", "Java", "SQL", "HTML/CSS"];
const ROW2 = [
  "React",
  "Next.js",
  "Flask",
  "AWS",
  "Docker",
  "PostgreSQL",
  "Prisma",
  "YOLOv8",
  "OpenCV",
  "Pandas",
];

function MarqueeRow({
  items,
  direction,
  playState,
}: {
  items: string[];
  direction: "ltr" | "rtl";
  playState: "running" | "paused";
}) {
  const doubled = [...items, ...items];
  return (
    <div className="marquee-mask overflow-hidden">
      <div
        className={`flex w-max gap-4 ${
          direction === "ltr" ? "animate-marquee-ltr" : "animate-marquee-rtl"
        }`}
        style={{ animationPlayState: playState }}
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center whitespace-nowrap rounded-md border border-hairline bg-surface-2 px-3 py-1.5 text-xs text-ink-lavender"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Stack() {
  const prefersReducedMotion = useReducedMotion();
  const [paused, setPaused] = useState(false);

  const playState: "running" | "paused" =
    paused || !!prefersReducedMotion ? "paused" : "running";

  const initial = prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 };
  const inView = { opacity: 1, y: 0 };
  const t = (delay: number) => ({
    duration: 0.4,
    ease: EASE,
    delay: prefersReducedMotion ? 0 : delay,
  });
  const viewport = { once: true, amount: 0.2 } as const;

  return (
    <section
      id="stack"
      className="mx-auto max-w-[1280px] px-6 py-20 sm:px-10 sm:py-24 lg:px-16"
    >
      <motion.div
        initial={initial}
        whileInView={inView}
        viewport={viewport}
        transition={t(0)}
      >
        <h2 className="text-[28px] font-semibold leading-[1.2] tracking-[-0.6px] text-ink">
          What I work with
        </h2>
        <p className="mt-2 text-sm leading-[1.5] text-ink-subtle">
          Languages, frameworks, and infrastructure I reach for.
        </p>
      </motion.div>

      <div
        className="marquee-bg mt-10 rounded-lg py-12 lg:mt-12"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="flex flex-col gap-4">
          <MarqueeRow items={ROW1} direction="ltr" playState={playState} />
          <MarqueeRow items={ROW2} direction="rtl" playState={playState} />
        </div>
      </div>
    </section>
  );
}

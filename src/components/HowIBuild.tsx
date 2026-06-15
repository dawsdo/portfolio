"use client";

import { motion, useReducedMotion } from "framer-motion";
import NodeGraph from "@/components/NodeGraph";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function HowIBuild() {
  const prefersReducedMotion = useReducedMotion();

  const initial = prefersReducedMotion
    ? { opacity: 1, y: 0 }
    : { opacity: 0, y: 8 };
  const inView = { opacity: 1, y: 0 };
  const t = (delay: number) => ({
    duration: 0.4,
    ease: EASE,
    delay: prefersReducedMotion ? 0 : delay,
  });
  const viewport = { once: true, amount: 0.2 } as const;

  return (
    <section
      id="how-i-build"
      className="mx-auto max-w-[1280px] px-6 py-20 sm:px-10 sm:py-24 lg:px-16"
    >
      <motion.div
        initial={initial}
        whileInView={inView}
        viewport={viewport}
        transition={t(0)}
      >
        <h2 className="text-[28px] font-semibold leading-[1.2] tracking-[-0.6px] text-ink">
          How I build
        </h2>
        <p className="mt-2 text-sm leading-[1.5] text-ink-subtle">
          A rough sketch of how problems and ideas turn into projects.
        </p>
      </motion.div>

      <div className="mt-10 lg:mt-12">
        <NodeGraph
          inputs={[
            { id: "problem", label: "a problem" },
            { id: "idea", label: "an idea" },
            { id: "dataset", label: "a dataset" },
          ]}
          outputs={[
            { id: "fullstack", label: "Full-stack web" },
            { id: "ml", label: "Real-time ML" },
            { id: "cloud", label: "Serverless cloud" },
          ]}
          chips={[
            {
              label: "Python",
              highlights: ["input-dataset", "output-ml", "output-cloud"],
            },
            {
              label: "TypeScript",
              highlights: ["input-idea", "output-fullstack"],
            },
            {
              label: "AWS",
              highlights: ["input-problem", "output-cloud"],
            },
            {
              label: "PostgreSQL",
              highlights: ["input-idea", "input-dataset", "output-fullstack"],
            },
            {
              label: "Computer Vision",
              highlights: ["input-dataset", "output-ml"],
            },
          ]}
        />
      </div>
    </section>
  );
}

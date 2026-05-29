"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";

const EASE = [0.16, 1, 0.3, 1] as const;

const COPY = [
  "I'm a CS student at UAB studying systems, the cloud, and applied ML, still chasing the same question I had at seven, staring at a screen of assembly code on the family computer and wondering what on earth it was.",
  "Soccer taught me most of what isn't on the resume: how to be sociable, how to get out of my comfort zone, and how to take steps toward caring for myself and my future when it feels uncertain.",
  "Right now that future looks like exploring GPU-accelerated computing for data science and ML workflows, and finding a Summer 2026 software engineering internship.",
];

export default function About() {
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
      id="about"
      className="mx-auto max-w-[1280px] px-6 pt-12 pb-20 sm:px-10 sm:pt-16 sm:pb-24 lg:px-16"
    >
      <motion.h2
        initial={initial}
        whileInView={inView}
        viewport={viewport}
        transition={t(0)}
        className="text-[28px] font-semibold leading-[1.2] tracking-[-0.6px] text-ink"
      >
        About me
      </motion.h2>

      <div className="mt-6 grid grid-cols-1 items-start gap-10 lg:mt-8 lg:grid-cols-[2fr_3fr] lg:gap-16">
        <motion.div
          initial={initial}
          whileInView={inView}
          viewport={viewport}
          transition={t(0)}
          className="relative aspect-square w-full max-w-[360px] overflow-hidden rounded-xl border border-hairline"
        >
          <Image
            src="/dawson.jpg"
            alt="Dawson Do"
            fill
            sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        </motion.div>

        <div className="max-w-[52ch] space-y-6 lg:space-y-7">
          {COPY.map((paragraph, i) => (
            <motion.p
              key={i}
              initial={initial}
              whileInView={inView}
              viewport={viewport}
              transition={t(0.08 * (i + 1))}
              className="text-lg leading-[1.5] tracking-[-0.01em] text-ink"
            >
              {paragraph}
            </motion.p>
          ))}
        </div>
      </div>
    </section>
  );
}

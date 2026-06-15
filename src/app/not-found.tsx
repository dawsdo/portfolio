"use client";

import { motion, useReducedMotion } from "framer-motion";
import Button from "@/components/Button";
import Magnetic from "@/components/Magnetic";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function NotFound() {
  const prefersReducedMotion = useReducedMotion();

  const initial = prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 };
  const animate = { opacity: 1, y: 0 };
  const t = (delay: number) => ({
    duration: 0.4,
    ease: EASE,
    delay: prefersReducedMotion ? 0 : delay,
  });

  return (
    <main className="flex min-h-screen items-center px-6 py-20 sm:py-32">
      <div className="mx-auto w-full max-w-2xl">
        <motion.h1
          initial={initial}
          animate={animate}
          transition={t(0)}
          className="text-[80px] font-semibold leading-none tracking-[-3px] text-ink"
          aria-label="404"
        >
          4<span className="text-primary">0</span>4
        </motion.h1>

        <motion.p
          initial={initial}
          animate={animate}
          transition={t(0.05)}
          className="mt-6 text-lg leading-[1.5] tracking-[-0.01em] text-ink-muted"
        >
          This page doesn&rsquo;t exist. Not yet, anyway.
        </motion.p>

        <motion.div
          initial={initial}
          animate={animate}
          transition={t(0.1)}
          className="mt-10"
        >
          <Magnetic>
            <Button href="/" variant="secondary">
              Back home
            </Button>
          </Magnetic>
        </motion.div>
      </div>
    </main>
  );
}

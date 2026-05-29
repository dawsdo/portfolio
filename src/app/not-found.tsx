"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import Button from "@/components/Button";

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
        <motion.p
          initial={initial}
          animate={animate}
          transition={t(0)}
          className="text-[80px] font-semibold leading-none tracking-[-3px] text-ink"
          aria-label="404"
        >
          4<span className="text-primary">0</span>4
        </motion.p>

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
          <Button href="/" variant="secondary">
            Back home
          </Button>
        </motion.div>
      </div>
    </main>
  );
}

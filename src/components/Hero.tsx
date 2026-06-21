"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Button from "@/components/Button";
import HeroGlint from "@/components/HeroGlint";
import Magnetic from "@/components/Magnetic";

const EASE = [0.16, 1, 0.3, 1] as const;

function LocalClock() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const formatter = (() => {
      try {
        return new Intl.DateTimeFormat(undefined, {
          hour: "numeric",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        });
      } catch {
        return null;
      }
    })();

    const tick = () => {
      if (!formatter) {
        setTime("--:--:--");
        return;
      }
      setTime(formatter.format(new Date()));
    };

    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <span
      suppressHydrationWarning
      aria-label="Your local time"
      className="font-mono text-xs tabular-nums text-ink-subtle"
    >
      {time ?? "--:--:-- --"}
    </span>
  );
}

function DayCountdown() {
  const [remaining, setRemaining] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => {
      try {
        const now = new Date();
        const midnight = new Date(now);
        midnight.setHours(24, 0, 0, 0);
        const diff = midnight.getTime() - now.getTime();
        const h = Math.floor(diff / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        setRemaining(
          `${h} hours, ${m} minutes, ${s} seconds left in the day — use them wisely.`,
        );
      } catch {
        setRemaining("Use today wisely.");
      }
    };

    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <p
      suppressHydrationWarning
      className="font-mono text-[12px] leading-[1.4] text-ink-tertiary"
    >
      {remaining ?? "Loading..."}
    </p>
  );
}

function StatusPill() {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-hairline bg-surface-1 px-3 py-1 text-[13px] text-ink-muted">
      <span
        className="relative inline-flex h-[9px] w-[9px] items-center justify-center"
        aria-hidden="true"
      >
        <span className="status-dot-ping absolute inset-0 rounded-full bg-success" />
        <span className="status-dot-core relative inline-block h-[9px] w-[9px] rounded-full bg-success" />
      </span>
      <span>Available for internships</span>
    </span>
  );
}

export default function Hero() {
  const prefersReducedMotion = useReducedMotion();
  const nameRef = useRef<HTMLHeadingElement>(null);

  const initial = prefersReducedMotion
    ? { opacity: 1, y: 0 }
    : { opacity: 0, y: 8 };
  const animate = { opacity: 1, y: 0 };
  const t = (delay: number) => ({
    duration: 0.4,
    ease: EASE,
    delay: prefersReducedMotion ? 0 : delay,
  });

  return (
    <section className="relative isolate overflow-hidden">
      <div className="mx-auto flex min-h-[88vh] max-w-[1280px] flex-col justify-start pt-16 pb-24 px-6 sm:justify-center sm:pt-32 sm:px-10 lg:px-16">
        <motion.div
          initial={initial}
          animate={animate}
          transition={t(0)}
          className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
        >
          <StatusPill />
          <LocalClock />
        </motion.div>

        <motion.div
          initial={initial}
          animate={animate}
          transition={t(0.05)}
          className="mt-2 pl-[29px]"
        >
          <DayCountdown />
        </motion.div>

        <div className="relative mt-10">
          <motion.h1
            ref={nameRef}
            initial={initial}
            animate={animate}
            transition={t(0.05)}
            className="text-[clamp(2.5rem,8vw,5rem)] font-semibold leading-[1.05] tracking-[-0.04em] text-ink"
          >
            Dawson Do
          </motion.h1>
          <HeroGlint nameRef={nameRef} />
        </div>

        <motion.p
          initial={initial}
          animate={animate}
          transition={t(0.1)}
          className="mt-6 max-w-[44ch] text-lg leading-[1.5] tracking-[-0.01em] text-ink-muted"
        >
          A lifetime student, drawn to how systems work under the hood.
          Currently studying CS at UAB.
        </motion.p>

        <motion.div
          initial={initial}
          animate={animate}
          transition={t(0.15)}
          className="mt-10 flex flex-wrap items-center gap-3"
        >
          <Magnetic>
            <Button href="#work" variant="primary">
              View work
            </Button>
          </Magnetic>
          <Magnetic>
            <Button href="#contact" variant="secondary">
              Get in touch
            </Button>
          </Magnetic>
        </motion.div>
      </div>
    </section>
  );
}

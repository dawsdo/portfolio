"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";

const SPRING = { stiffness: 300, damping: 30 };
const THRESHOLD = 80;
const MAX_PULL = 4;

export default function Magnetic({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  // Cached resting center — captured once on mouseenter, never updated during the
  // hover session. Prevents the feedback loop where getBoundingClientRect returns
  // the already-transformed position, making distance shrink → strength grow → drift.
  const restingCenter = useRef({ cx: 0, cy: 0 });

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, SPRING);
  const y = useSpring(rawY, SPRING);

  const handleMouseEnter = () => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const xNow = x.get();
    const yNow = y.get();
    restingCenter.current = {
      cx: rect.left + rect.width / 2 - xNow,
      cy: rect.top + rect.height / 2 - yNow,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (prefersReducedMotion) return;
    const { cx, cy } = restingCenter.current;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const strength = Math.max(0, 1 - distance / THRESHOLD);
    const safeDist = Math.max(distance, 0.1);
    const pullX = (dx / safeDist) * strength * MAX_PULL;
    const pullY = (dy / safeDist) * strength * MAX_PULL;

    rawX.set(pullX);
    rawY.set(pullY);
  };

  const handleMouseLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      style={{ x, y }}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.div>
  );
}

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

export type GraphNode = { id: string; label: string };
export type ChipData = { label: string; highlights: string[] };

export type NodeGraphProps = {
  inputs: GraphNode[];
  outputs: GraphNode[];
  chips: ChipData[];
};

const NODE_W = 128;
const NODE_H = 40;

const HUB_CX = 480;
const HUB_CY = 180;
const HUB_R = 60;
const HUB_HALO_R = 72;

const INPUT_RECT_X = 80;
const INPUT_EDGE_X = INPUT_RECT_X + NODE_W;
const OUTPUT_RECT_X = 720;
const OUTPUT_EDGE_X = OUTPUT_RECT_X;

const Y_LEVELS = [50, 180, 310] as const;

const HUB_LEFT = HUB_CX - HUB_R;
const HUB_RIGHT = HUB_CX + HUB_R;
const IN_MID_X = (INPUT_EDGE_X + HUB_LEFT) / 2;
const OUT_MID_X = (HUB_RIGHT + OUTPUT_EDGE_X) / 2;

const inputPath = (y: number) =>
  `M ${INPUT_EDGE_X} ${y} C ${IN_MID_X} ${y}, ${IN_MID_X} ${HUB_CY}, ${HUB_LEFT} ${HUB_CY}`;
const outputPath = (y: number) =>
  `M ${HUB_RIGHT} ${HUB_CY} C ${OUT_MID_X} ${HUB_CY}, ${OUT_MID_X} ${y}, ${OUTPUT_EDGE_X} ${y}`;

const PERIOD = 2.4;
const PHASES = [0, 0.2, 0.4, 0.7, 0.9, 1.1] as const;

const EASE = [0.16, 1, 0.3, 1] as const;
const EASE_CSS = "cubic-bezier(0.16, 1, 0.3, 1)";

type Wire = {
  id: string;
  d: string;
  direction: "input" | "output";
  start: { x: number; y: number };
  end: { x: number; y: number };
};

function Node({ x, y, label }: { x: number; y: number; label: string }) {
  const rectTop = y - NODE_H / 2;
  return (
    <g>
      <rect
        x={x}
        y={rectTop}
        width={NODE_W}
        height={NODE_H}
        rx={10}
        ry={10}
        fill="url(#node-grad)"
        stroke="var(--color-hairline)"
        strokeWidth={1}
      />
      <line
        x1={x + 2}
        y1={rectTop + 0.5}
        x2={x + NODE_W - 2}
        y2={rectTop + 0.5}
        stroke="var(--color-ink-tertiary)"
        strokeOpacity={0.4}
        strokeWidth={1}
      />
      <text
        x={x + NODE_W / 2}
        y={y}
        fontSize={12}
        fill="var(--color-ink-muted)"
        textAnchor="middle"
        dominantBaseline="central"
        className="font-sans"
      >
        {label}
      </text>
    </g>
  );
}

export default function NodeGraph({ inputs, outputs, chips }: NodeGraphProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const animateGraph = isInView && !prefersReducedMotion;

  const [hoveredChip, setHoveredChip] = useState<string | null>(null);

  const wires: Wire[] = useMemo(() => {
    const ins: Wire[] = inputs.slice(0, 3).map((n, i) => ({
      id: `input-${n.id}`,
      d: inputPath(Y_LEVELS[i]),
      direction: "input",
      start: { x: INPUT_EDGE_X, y: Y_LEVELS[i] },
      end: { x: HUB_LEFT, y: HUB_CY },
    }));
    const outs: Wire[] = outputs.slice(0, 3).map((n, i) => ({
      id: `output-${n.id}`,
      d: outputPath(Y_LEVELS[i]),
      direction: "output",
      start: { x: HUB_RIGHT, y: HUB_CY },
      end: { x: OUTPUT_EDGE_X, y: Y_LEVELS[i] },
    }));
    return [...ins, ...outs];
  }, [inputs, outputs]);

  const highlighted = useMemo(() => {
    if (!hoveredChip) return null;
    const chip = chips.find((c) => c.label === hoveredChip);
    return chip ? new Set(chip.highlights) : null;
  }, [hoveredChip, chips]);

  useEffect(() => {
    if (!animateGraph) return;
    const el = document.getElementById("pulse-0") as
      | (SVGElement & { beginElement?: () => void })
      | null;
    if (el && typeof el.beginElement === "function") {
      try {
        el.beginElement();
      } catch {
        // ignored
      }
    }
  }, [animateGraph]);

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

  const wireTransition = prefersReducedMotion
    ? "none"
    : `stroke 200ms ${EASE_CSS}, stroke-opacity 200ms ${EASE_CSS}`;

  return (
    <div ref={ref}>
      <motion.div
        initial={initial}
        whileInView={inView}
        viewport={viewport}
        transition={t(0.12)}
        className="relative"
      >
        <div className="-mx-6 overflow-x-auto sm:mx-0">
          <div className="min-w-[760px] px-6 sm:min-w-0 sm:px-0">
            <svg
              viewBox="0 0 960 360"
              role="img"
              aria-label="A diagram of how Dawson builds: inputs (a problem, an idea, a dataset) flow into a central hub and out as full-stack web, real-time ML, and serverless cloud projects."
              className="block h-auto w-full"
            >
              <defs>
                <filter
                  id="wire-glow"
                  x="-20%"
                  y="-20%"
                  width="140%"
                  height="140%"
                >
                  <feGaussianBlur stdDeviation="2.5" />
                </filter>
                <linearGradient id="node-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-surface-2)" />
                  <stop offset="100%" stopColor="var(--color-surface-1)" />
                </linearGradient>
                <radialGradient id="hub-grad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="var(--color-surface-1)" />
                  <stop offset="100%" stopColor="var(--color-surface-2)" />
                </radialGradient>
                {wires.map((wire) => (
                  <linearGradient
                    key={`grad-${wire.id}`}
                    id={`wire-grad-${wire.id}`}
                    gradientUnits="userSpaceOnUse"
                    x1={wire.start.x}
                    y1={wire.start.y}
                    x2={wire.end.x}
                    y2={wire.end.y}
                  >
                    {wire.direction === "input" ? (
                      <>
                        <stop
                          offset="0%"
                          stopColor="var(--color-hairline-strong)"
                        />
                        <stop
                          offset="100%"
                          stopColor="var(--color-ink-lavender)"
                          stopOpacity="0.7"
                        />
                      </>
                    ) : (
                      <>
                        <stop
                          offset="0%"
                          stopColor="var(--color-ink-lavender)"
                          stopOpacity="0.7"
                        />
                        <stop
                          offset="100%"
                          stopColor="var(--color-hairline-strong)"
                        />
                      </>
                    )}
                  </linearGradient>
                ))}
              </defs>

              {/* Hub outer halo — softest, lowest layer */}
              <circle
                cx={HUB_CX}
                cy={HUB_CY}
                r={HUB_HALO_R}
                fill="var(--color-primary)"
                fillOpacity={0.12}
                filter="url(#wire-glow)"
              />

              {/* Layer A — wire glow */}
              <g>
                {wires.map((wire) => (
                  <path
                    key={`glow-${wire.id}`}
                    d={wire.d}
                    fill="none"
                    stroke="var(--color-primary)"
                    strokeOpacity={0.18}
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    filter="url(#wire-glow)"
                  />
                ))}
              </g>

              {/* Layer B — crisp gradient wires */}
              <g>
                {wires.map((wire) => {
                  let stroke = `url(#wire-grad-${wire.id})`;
                  let strokeOpacity = 1;
                  if (highlighted) {
                    if (highlighted.has(wire.id)) {
                      stroke = "var(--color-primary)";
                      strokeOpacity = 1;
                    } else {
                      strokeOpacity = 0.08;
                    }
                  }
                  return (
                    <path
                      key={wire.id}
                      id={wire.id}
                      d={wire.d}
                      fill="none"
                      stroke={stroke}
                      strokeOpacity={strokeOpacity}
                      strokeWidth={1}
                      strokeLinecap="round"
                      style={{ transition: wireTransition }}
                    />
                  );
                })}
              </g>

              {/* Input nodes */}
              {inputs.slice(0, 3).map((node, i) => (
                <Node
                  key={node.id}
                  x={INPUT_RECT_X}
                  y={Y_LEVELS[i]}
                  label={node.label}
                />
              ))}

              {/* Output nodes */}
              {outputs.slice(0, 3).map((node, i) => (
                <Node
                  key={node.id}
                  x={OUTPUT_RECT_X}
                  y={Y_LEVELS[i]}
                  label={node.label}
                />
              ))}

              {/* Hub */}
              <g>
                <circle
                  cx={HUB_CX}
                  cy={HUB_CY}
                  r={HUB_R}
                  fill="url(#hub-grad)"
                  stroke="var(--color-primary)"
                  strokeOpacity={0.4}
                  strokeWidth={1}
                />
                <motion.circle
                  cx={HUB_CX}
                  cy={HUB_CY}
                  r={4}
                  fill="var(--color-primary)"
                  animate={animateGraph ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                  transition={
                    animateGraph
                      ? {
                          duration: 3.2,
                          ease: [0.4, 0, 0.2, 1],
                          repeat: Infinity,
                        }
                      : { duration: 0 }
                  }
                  style={{
                    transformBox: "fill-box",
                    transformOrigin: "center",
                  }}
                />
              </g>

              {/* Pulses — 6 wires, continuous, phase-locked to pulse-0 */}
              {!prefersReducedMotion &&
                wires.map((wire, i) => {
                  const beginExpr =
                    i === 0 ? "indefinite" : `pulse-0.begin+${PHASES[i]}s`;
                  return (
                    <circle
                      key={`pulse-${i}`}
                      r={4}
                      fill="var(--color-primary)"
                      opacity={0}
                      aria-hidden="true"
                    >
                      <animateMotion
                        id={`pulse-${i}`}
                        begin={beginExpr}
                        dur={`${PERIOD}s`}
                        repeatCount="indefinite"
                        keyTimes="0;0.583;1"
                        keyPoints="0;1;1"
                        calcMode="linear"
                      >
                        <mpath href={`#${wire.id}`} />
                      </animateMotion>
                      <animate
                        attributeName="opacity"
                        values="0;1;1;0;0"
                        keyTimes="0;0.083;0.5;0.583;1"
                        begin={`pulse-${i}.begin`}
                        dur={`${PERIOD}s`}
                        repeatCount="indefinite"
                      />
                    </circle>
                  );
                })}
            </svg>
          </div>
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-canvas to-transparent sm:hidden"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-canvas to-transparent sm:hidden"
        />
      </motion.div>

      <ul className="mt-10 flex flex-wrap justify-center gap-2">
        {chips.map((chip, i) => (
          <motion.li
            key={chip.label}
            role="button"
            initial={initial}
            whileInView={inView}
            viewport={viewport}
            transition={t(0.24 + i * 0.04)}
            onMouseEnter={() => setHoveredChip(chip.label)}
            onMouseLeave={() => setHoveredChip(null)}
            onFocus={() => setHoveredChip(chip.label)}
            onBlur={() => setHoveredChip(null)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setHoveredChip(hoveredChip === chip.label ? null : chip.label);
              }
            }}
            tabIndex={0}
            className="inline-flex cursor-pointer items-center rounded-md border border-hairline bg-surface-2 px-2.5 py-1 text-xs text-ink-lavender transition duration-200 ease-linear-out hover:bg-surface-3 focus-visible:bg-surface-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-focus"
          >
            {chip.label}
          </motion.li>
        ))}
      </ul>
      <p className="mt-4 text-center text-xs italic text-ink-tertiary">
        Hover a chip to see how it threads through.
      </p>
    </div>
  );
}

"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

// Mirrors --color-primary (#5e6ad2) from globals.css
const ACCENT = "#5e6ad2";
const ACCENT_RGB = "94, 106, 210";

const TOTAL_MS = 2000;

// Phase end times (0–1). Five phases sum to 1.
const P1 = 0.32; // corkscrew ends
const P2 = 0.46; // drift-to-rest ends
const P3 = 0.62; // vertical bob ends
const P4 = 0.85; // shimmer ends
// P5: 0.85–1.0  fly away up-right

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeIn = (t: number) => t * t * t;

function drawStar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
) {
  const arms = 4;
  const inner = r * 0.3;
  ctx.beginPath();
  for (let i = 0; i < arms * 2; i++) {
    const angle = (i / (arms * 2)) * Math.PI * 2 - Math.PI / 4;
    const rad = i % 2 === 0 ? r : inner;
    const px = cx + Math.cos(angle) * rad;
    const py = cy + Math.sin(angle) * rad;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
}

interface Props {
  nameRef: React.RefObject<HTMLHeadingElement | null>;
}

export default function HeroGlint({ nameRef }: Props) {
  const prefersReducedMotion = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    // Authoritative runtime check (catches dynamic preference changes)
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = canvasRef.current;
    const h1 = nameRef.current;
    if (!canvas || !h1) return;

    // canvas.getContext("2d") is always non-null for a valid <canvas> element
    const ctx = canvas.getContext("2d")!;

    // Measure rendered text width using the h1's computed font
    const cs = window.getComputedStyle(h1);
    const tmpCtx = document.createElement("canvas").getContext("2d")!;
    tmpCtx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    const textW = Math.ceil(tmpCtx.measureText("Dawson Do").width);

    const CW = h1.offsetWidth;
    const CH = h1.offsetHeight;

    if (CW === 0 || CH === 0) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = CW * dpr;
    canvas.height = CH * dpr;
    canvas.style.width = `${CW}px`;
    canvas.style.height = `${CH}px`;
    ctx.scale(dpr, dpr);

    // Glint geometry anchored to the measured text
    const TX1 = Math.min(textW, CW - 4);     // text right edge
    const restX = Math.min(TX1 + 14, CW - 8); // rest position just past name end
    const restY = CH * 0.5;
    const SIZE = Math.max(4, CH * 0.065);      // proportional star radius

    const trail: Array<{ x: number; y: number }> = [];
    let startTime: number | null = null;

    function draw(now: number) {
      if (!startTime) startTime = now;
      const t = Math.min((now - startTime) / TOTAL_MS, 1.0);

      ctx.clearRect(0, 0, CW, CH);

      let gx: number;
      let gy: number;
      let alpha = 1;

      if (t < P1) {
        // Phase 1 — corkscrew diagonal: BL → TR, coil tightens as it crosses
        const pt = t / P1;
        const ex = easeOut(pt);
        gx = ex * TX1;
        gy = CH - ex * CH * 0.85;
        const amp = (1 - pt) * CH * 0.28;
        gy += Math.sin(pt * Math.PI * 2 * 3.5) * amp;

      } else if (t < P2) {
        // Phase 2 — drift to rest position, ease to stop
        const pt = (t - P1) / (P2 - P1);
        const ex = easeOut(pt);
        const startX = TX1;
        const startY = CH * 0.15;
        gx = startX + ex * (restX - startX);
        gy = startY + ex * (restY - startY);

      } else if (t < P3) {
        // Phase 3 — gentle vertical bob in place
        const pt = (t - P2) / (P3 - P2);
        gx = restX;
        gy = restY + Math.sin(pt * Math.PI * 3) * CH * 0.07;

      } else if (t < P4) {
        // Phase 4 — shimmer: pulsing star + 8 rotating sparkle rays
        const pt = (t - P3) / (P4 - P3);
        gx = restX;
        gy = restY;

        const rayLen = 8 + Math.abs(Math.sin(pt * Math.PI * 5)) * 10;
        const innerR = SIZE + 3;
        ctx.save();
        ctx.strokeStyle = ACCENT;
        ctx.lineWidth = 1.2;
        for (let i = 0; i < 8; i++) {
          const angle = (i / 8) * Math.PI * 2 + pt * 0.8;
          ctx.globalAlpha =
            0.45 + 0.45 * Math.abs(Math.sin(pt * Math.PI * 4 + i));
          ctx.beginPath();
          ctx.moveTo(
            gx + Math.cos(angle) * innerR,
            gy + Math.sin(angle) * innerR,
          );
          ctx.lineTo(
            gx + Math.cos(angle) * (innerR + rayLen),
            gy + Math.sin(angle) * (innerR + rayLen),
          );
          ctx.stroke();
        }
        ctx.restore();
        ctx.globalAlpha = 1;

      } else {
        // Phase 5 — accelerate up-right and fade out
        const pt = (t - P4) / (1 - P4);
        const ex = easeIn(pt);
        gx = restX + ex * CW * 0.55;
        gy = restY - ex * CH * 2.5;
        alpha = 1 - pt;
      }

      // Fade trail
      trail.push({ x: gx, y: gy });
      if (trail.length > 12) trail.shift();

      for (let i = 0; i < trail.length; i++) {
        const tf = i / trail.length;
        const p = trail[i];
        ctx.globalAlpha = tf * tf * 0.3 * alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, SIZE * 0.45 * tf, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${ACCENT_RGB}, 1)`;
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Glow + star
      if (alpha > 0.01) {
        const glowR = SIZE * 2.8;
        const grd = ctx.createRadialGradient(gx, gy, 0, gx, gy, glowR);
        grd.addColorStop(0, `rgba(${ACCENT_RGB}, 0.5)`);
        grd.addColorStop(1, `rgba(${ACCENT_RGB}, 0)`);

        ctx.globalAlpha = alpha * 0.65;
        ctx.beginPath();
        ctx.arc(gx, gy, glowR, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        ctx.globalAlpha = alpha;
        drawStar(ctx, gx, gy, SIZE);
        ctx.fillStyle = ACCENT;
        ctx.fill();

        ctx.globalAlpha = 1;
      }

      if (t < 1) {
        rafRef.current = requestAnimationFrame(draw);
      }
    }

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [nameRef]);

  // Hook-based check handles SSR and dynamic preference changes
  if (prefersReducedMotion) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
    />
  );
}

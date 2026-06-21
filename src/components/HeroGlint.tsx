"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

interface Props {
  nameRef: React.RefObject<HTMLHeadingElement | null>;
}

export default function HeroGlint({ nameRef }: Props) {
  const prefersReducedMotion = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const cv = canvasRef.current;
    const h1 = nameRef.current;
    if (!cv || !h1) return;

    const ctx = cv.getContext("2d")!;
    const W = h1.offsetWidth;
    const H = h1.offsetHeight;

    if (W === 0 || H === 0) return;

    const dpr = window.devicePixelRatio || 1;
    cv.width = W * dpr;
    cv.height = H * dpr;
    cv.style.width = `${W}px`;
    cv.style.height = `${H}px`;
    ctx.scale(dpr, dpr);

    const cs = window.getComputedStyle(h1);
    const tmpCtx = document.createElement("canvas").getContext("2d")!;
    tmpCtx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    const textW = Math.ceil(tmpCtx.measureText("Dawson Do").width);

    const start = performance.now();
    const DUR = 3400;
    let raf: number;
    const trail: [number, number][] = [];

    // 80px past the measured text right edge, clamped on-canvas
    const sideX = Math.min(textW + 80, W - 20);
    const sideY = H / 2 - 8;

    function pos(p: number): [number, number] {
      if (p < 0.34) {
        // diagonal corkscrew across the name
        const u = p / 0.34;
        const baseX = 40 + u * (W - 80); // left → right across full width
        const baseY = H - 18 - u * (H - 36); // bottom → top (diagonal)
        const coil = Math.sin(u * Math.PI * 4) * (14 * (1 - u * 0.4)); // tightening coil
        const coilY = Math.cos(u * Math.PI * 4) * (9 * (1 - u * 0.4));
        return [baseX + coil, baseY + coilY];
      } else if (p < 0.52) {
        // drift off to the side, easing to rest
        const u = (p - 0.34) / 0.18;
        const e = u * u * (3 - 2 * u);
        const fromX = W - 40, fromY = 18;
        return [fromX + e * (sideX - fromX), fromY + e * (sideY - fromY)];
      } else if (p < 0.7) {
        // hover: hold, gentle bob
        const u = (p - 0.52) / 0.18;
        return [sideX, sideY + Math.sin(u * Math.PI * 2) * 3];
      } else if (p < 0.84) {
        // shimmer: stay put (pulse handled below)
        return [sideX, sideY];
      } else {
        // fly away up-right
        const u = (p - 0.84) / 0.16;
        return [sideX + u * u * 220, sideY - u * u * 160];
      }
    }

    function glint(x: number, y: number, s: number, rot: number, a: number) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.beginPath();
      for (let i = 0; i < 4; i++) {
        ctx.rotate(Math.PI / 2);
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(s * 0.18, s * 0.18, s, 0);
        ctx.quadraticCurveTo(s * 0.18, -s * 0.18, 0, 0);
      }
      ctx.fillStyle = `rgba(178,208,255,${a})`;
      ctx.fill();
      ctx.restore();
    }

    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / DUR);
      ctx.clearRect(0, 0, W, H);
      const [px, py] = pos(p);

      // trail
      trail.push([px, py]);
      if (trail.length > 22) trail.shift();
      trail.forEach(([x, y], i) => {
        const al = i / trail.length;
        ctx.beginPath();
        ctx.arc(x, y, 1.5 * al + 0.3, 0, 7);
        ctx.fillStyle = `rgba(91,141,239,${al * 0.65})`;
        ctx.fill();
      });

      let s = 5, a = 0.95;

      // shimmer beat: pulse + sparkle rays
      if (p >= 0.7 && p < 0.84) {
        const u = (p - 0.7) / 0.14;
        const pulse = Math.sin(u * Math.PI);
        s = 5 + pulse * 5;
        ctx.beginPath();
        ctx.arc(px, py, s * 2.4 * pulse, 0, 7);
        ctx.fillStyle = `rgba(178,208,255,${0.18 * pulse})`;
        ctx.fill();
        ctx.strokeStyle = `rgba(178,208,255,${0.5 * pulse})`;
        ctx.lineWidth = 1;
        for (let k = 0; k < 4; k++) {
          const ang = (k / 4) * Math.PI * 2 + u * 1.5;
          ctx.beginPath();
          ctx.moveTo(px + Math.cos(ang) * 7, py + Math.sin(ang) * 7);
          ctx.lineTo(
            px + Math.cos(ang) * (10 + pulse * 6),
            py + Math.sin(ang) * (10 + pulse * 6),
          );
          ctx.stroke();
        }
      }

      if (p > 0.84) a = 1 - (p - 0.84) / 0.16;
      glint(px, py, s, p * 7, a);

      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
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

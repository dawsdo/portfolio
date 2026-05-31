"use client";

import { useEffect, useRef } from "react";

/*
  Canvas-rendered aurora for the hero. Each "ribbon" is a sine-displaced
  horizontal path; we stamp a soft radial-gradient sprite many times along
  that path with globalCompositeOperation = "lighter" so the overlaps build
  up like real light rather than reading as a painted stroke.

  Restraint is the whole point — low per-stamp alpha, brand lavender only,
  confined to the lower portion so the hero text area stays near-canvas.
*/

type Ribbon = {
  baseYFrac: number; // vertical anchor as fraction of canvas height
  direction: 1 | -1; // flow direction of the travelling wave
  color: [number, number, number];
  alpha: number; // alpha per stamp (the brightness knob)
  radius: number; // stamp radius in CSS px (the softness/spread knob)
  amplitude: number; // vertical undulation in px
  phaseSpeed: number; // phase advance per rendered frame (the speed knob)
  wavelengthFrac: number; // wave length as a fraction of canvas width
};

const RIBBONS: Ribbon[] = [
  {
    baseYFrac: 0.88,
    direction: 1,
    color: [94, 106, 210], // #5e6ad2 — brand lavender
    alpha: 0.04,
    radius: 150,
    amplitude: 25,
    phaseSpeed: 0.0035,
    wavelengthFrac: 0.9,
  },
  {
    baseYFrac: 0.95,
    direction: -1,
    color: [130, 143, 255], // #828fff — lighter lavender hover tint
    alpha: 0.03,
    radius: 180,
    amplitude: 25,
    phaseSpeed: 0.0028,
    wavelengthFrac: 1.1,
  },
];

// Distance between sprite stamps along a path. Smaller = smoother band,
// more draw calls. At ~22px with 150px+ radii the stamps heavily overlap.
const STEP = 22;

const TARGET_FPS = 30;
const FRAME_MS = 1000 / TARGET_FPS;

type Sprite = HTMLCanvasElement | OffscreenCanvas;

function makeSprite(radius: number, [r, g, b]: [number, number, number]): Sprite {
  const size = radius * 2;
  const sprite: Sprite =
    typeof OffscreenCanvas !== "undefined"
      ? new OffscreenCanvas(size, size)
      : document.createElement("canvas");
  sprite.width = size;
  sprite.height = size;
  const sctx = sprite.getContext("2d") as
    | CanvasRenderingContext2D
    | OffscreenCanvasRenderingContext2D
    | null;
  if (!sctx) return sprite;
  const grad = sctx.createRadialGradient(
    radius,
    radius,
    0,
    radius,
    radius,
    radius,
  );
  grad.addColorStop(0, `rgba(${r},${g},${b},1)`);
  grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
  sctx.fillStyle = grad;
  sctx.beginPath();
  sctx.arc(radius, radius, radius, 0, Math.PI * 2);
  sctx.fill();
  return sprite;
}

export default function HeroAurora() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let width = 0;
    let height = 0;

    const sprites = RIBBONS.map((r) => makeSprite(r.radius, r.color));
    const phases = RIBBONS.map(() => 0);

    let rafId = 0;
    let running = false;
    let lastTime = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      // Draw in CSS-pixel space; the transform handles retina scaling.
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";
      RIBBONS.forEach((ribbon, i) => {
        const sprite = sprites[i] as CanvasImageSource;
        const baseY = height * ribbon.baseYFrac;
        const k = (Math.PI * 2) / (width * ribbon.wavelengthFrac);
        const phase = phases[i];
        const d = ribbon.radius * 2;
        ctx.globalAlpha = ribbon.alpha;
        for (let x = -ribbon.radius; x <= width + ribbon.radius; x += STEP) {
          const y =
            baseY + ribbon.amplitude * Math.sin(x * k + phase * ribbon.direction);
          ctx.drawImage(sprite, x - ribbon.radius, y - ribbon.radius, d, d);
        }
      });
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    };

    const loop = (t: number) => {
      rafId = requestAnimationFrame(loop);
      if (t - lastTime < FRAME_MS) return; // throttle to ~30fps
      lastTime = t;
      for (let i = 0; i < RIBBONS.length; i++) {
        phases[i] += RIBBONS[i].phaseSpeed;
      }
      draw();
    };

    const start = () => {
      if (running || reduceMotion) return;
      running = true;
      lastTime = 0;
      rafId = requestAnimationFrame(loop);
    };

    const stop = () => {
      running = false;
      cancelAnimationFrame(rafId);
    };

    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        resize();
        if (!running) draw(); // keep a static frame correct while paused
      }, 150);
    };

    resize();

    let observer: IntersectionObserver | null = null;

    if (reduceMotion) {
      // Static snapshot — a single mid-flow frame, no animation.
      phases[0] = 0.6;
      phases[1] = 1.2;
      draw();
    } else {
      draw(); // paint an initial frame immediately
      start(); // start the loop directly — don't wait on the observer's first callback
      observer = new IntersectionObserver(
        (entries) => {
          // Observer now only pauses/resumes; start() is idempotent via the running guard.
          if (entries[0]?.isIntersecting) start();
          else stop();
        },
        { threshold: 0 },
      );
      observer.observe(canvas);
    }

    window.addEventListener("resize", onResize);

    return () => {
      stop();
      observer?.disconnect();
      window.removeEventListener("resize", onResize);
      window.clearTimeout(resizeTimer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      role="presentation"
      className="pointer-events-none absolute inset-0 z-0 h-full w-full"
    />
  );
}

"use client";

import { useEffect, useRef } from "react";

export default function CursorEffects() {
  const spotlightRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const noMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const noHover = window.matchMedia("(hover: none)").matches;
    if (noMotion || noHover) return;

    const spotlight = spotlightRef.current;
    const dot = dotRef.current;
    if (!spotlight || !dot) return;

    const cursor = { x: 0, y: 0 };
    const dotPos = { x: 0, y: 0 };
    let initialized = false;
    let isInteractive = false;
    let prevInteractive = false;
    let rafId: number;

    const onMouseMove = (e: MouseEvent) => {
      cursor.x = e.clientX;
      cursor.y = e.clientY;
      if (!initialized) {
        initialized = true;
        dotPos.x = e.clientX;
        dotPos.y = e.clientY;
        spotlight.style.opacity = "1";
        dot.style.opacity = "0.4";
        console.log("[cursor] spotlight zIndex:", spotlight.style.zIndex, "| dot zIndex:", dot.style.zIndex);
      }
    };

    const onMouseOver = (e: MouseEvent) => {
      isInteractive = !!(e.target as Element).closest(
        'a, button, [role="button"]',
      );
    };

    const loop = () => {
      if (initialized) {
        // Spotlight snaps to cursor
        spotlight.style.transform = `translate(${cursor.x}px, ${cursor.y}px) translate(-50%, -50%)`;

        // Trailing dot lerps toward cursor (0.15 factor ≈ 237ms to 90% convergence)
        dotPos.x += (cursor.x - dotPos.x) * 0.15;
        dotPos.y += (cursor.y - dotPos.y) * 0.15;
        // Offset by -3px so 6px dot is centered on dotPos.
        // Use CSS `translate` property (independent of `transform`) so the
        // scale transition never clobbers the positional update.
        dot.style.translate = `${dotPos.x - 3}px ${dotPos.y - 3}px`;

        // Scale + opacity only update on state change — keeps CSS transition intact
        if (isInteractive !== prevInteractive) {
          prevInteractive = isInteractive;
          dot.style.transform = isInteractive ? "scale(1.5)" : "scale(1)";
          dot.style.opacity = isInteractive ? "0.6" : "0.4";
          // DIAGNOSTIC — remove after confirming dot stays on cursor during scale
          console.log(
            "[dot state]", isInteractive ? "→ interactive" : "→ normal",
            "| translate:", +(dotPos.x - 3).toFixed(1), +(dotPos.y - 3).toFixed(1),
            "| cursor:", +cursor.x.toFixed(1), +cursor.y.toFixed(1),
          );
        }
      }
      rafId = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseover", onMouseOver, { passive: true });
    rafId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onMouseOver);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      <div
        ref={spotlightRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "480px",
          height: "480px",
          pointerEvents: "none",
          zIndex: 10,
          opacity: 0,
          background:
            "radial-gradient(circle at center, rgba(94, 106, 210, 0.10) 0%, transparent 60%)",
          willChange: "transform",
        }}
      />
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          backgroundColor: "var(--color-primary)",
          pointerEvents: "none",
          zIndex: 100,
          opacity: 0,
          willChange: "transform",
          transition:
            "transform 200ms cubic-bezier(0.16, 1, 0.3, 1), opacity 200ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      />
    </>
  );
}

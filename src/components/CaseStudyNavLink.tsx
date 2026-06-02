"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";

type Props = {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  status: "published" | "stub";
  direction: "prev" | "next";
};

export function CaseStudyNavLink({
  slug,
  title,
  description,
  tags,
  status,
  direction,
}: Props) {
  const [visible, setVisible] = useState(false);
  const [flipBelow, setFlipBelow] = useState(false);
  const showTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = useCallback(() => {
    if (hideTimerRef.current !== null) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
    if (showTimerRef.current !== null) {
      clearTimeout(showTimerRef.current);
    }
    showTimerRef.current = setTimeout(() => {
      showTimerRef.current = null;
      if (containerRef.current) {
        const { top } = containerRef.current.getBoundingClientRect();
        // ~140px estimated popup height + 12px gap + buffer
        setFlipBelow(top < 160);
      }
      setVisible(true);
    }, 400);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (showTimerRef.current !== null) {
      clearTimeout(showTimerRef.current);
      showTimerRef.current = null;
    }
    hideTimerRef.current = setTimeout(() => {
      hideTimerRef.current = null;
      setVisible(false);
    }, 100);
  }, []);

  const isPrev = direction === "prev";

  return (
    <div
      ref={containerRef}
      className={`relative max-w-[45%] ${isPrev ? "" : "flex flex-col items-end"}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/*
        Transparent bridge — fills the 12px gap between the link's top edge and
        the popup's bottom edge. Because it's a DOM descendant of the container,
        the cursor traveling through it does not trigger mouseleave on the container.
      */}
      <div
        aria-hidden="true"
        className={`absolute left-0 right-0 h-3 ${flipBelow ? "top-full" : "bottom-full"}`}
      />

      {/* Preview popup */}
      <div
        aria-hidden="true"
        className={[
          "absolute z-50 w-[280px] rounded-md border border-hairline bg-surface-2 p-4",
          isPrev ? "left-0" : "right-0",
          flipBelow ? "top-[calc(100%+12px)]" : "bottom-[calc(100%+12px)]",
          "transition-opacity motion-reduce:transition-none",
          visible
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        ].join(" ")}
        style={{
          transitionDuration: visible ? "200ms" : "150ms",
          transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {status === "stub" && (
          <span className="mb-2 block font-mono text-[12px] tracking-[0.05em] text-ink-tertiary">
            Coming soon
          </span>
        )}
        <p className="truncate text-[18px] font-medium leading-snug tracking-[-0.01em] text-ink">
          {title}
        </p>
        <p className="mt-1.5 line-clamp-2 text-base leading-relaxed text-ink-muted">
          {description}
        </p>
        {tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded border border-hairline bg-surface-3 px-1.5 py-0.5 font-mono text-[11px] tracking-[0.02em] text-ink-lavender"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Navigation link — original markup preserved exactly */}
      <Link
        href={`/projects/${slug}`}
        aria-label={`${isPrev ? "Previous" : "Next"} case study: ${title}`}
        className={[
          isPrev ? "cs-nav-prev" : "cs-nav-next",
          "inline-flex flex-col rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-focus",
          !isPrev ? "items-end" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <span className="font-mono text-[12px] tracking-[0.05em] text-ink-subtle">
          {isPrev ? "Previous" : "Next"}
        </span>
        <span
          className={`cs-nav-link-title mt-1.5 flex items-baseline gap-1.5 text-sm leading-snug tracking-[-0.01em] text-ink-subtle${!isPrev ? " text-right" : ""}`}
        >
          {isPrev && <span className="cs-nav-arrow shrink-0">←</span>}
          <span>
            {title}
            {status === "stub" && (
              <span className="ml-1.5 !text-ink-tertiary">(coming soon)</span>
            )}
          </span>
          {!isPrev && <span className="cs-nav-arrow shrink-0">→</span>}
        </span>
      </Link>
    </div>
  );
}

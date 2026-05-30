"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Magnetic from "@/components/Magnetic";

const EASE = [0.16, 1, 0.3, 1] as const;

const QUOTES = [
  {
    text: "What I cannot create, I do not understand.",
    attribution: "Richard Feynman",
  },
  {
    text: "Simplicity is prerequisite for reliability.",
    attribution: "Edsger Dijkstra",
  },
  {
    text: "Make it work, make it right, make it fast.",
    attribution: "Kent Beck",
  },
  {
    text: "If you can't explain it simply, you don't understand it well enough.",
    attribution: "Albert Einstein",
  },
  {
    text: "The best way to predict the future is to invent it.",
    attribution: "Alan Kay",
  },
  {
    text: "You can't connect the dots looking forward. You can only connect them looking backwards.",
    attribution: "Steve Jobs",
  },
  {
    text: "Premature optimization is the root of all evil.",
    attribution: "Donald Knuth",
  },
];

const CONTACTS = [
  {
    label: "Email",
    href: "mailto:dsdoapps@gmail.com",
    display: "dsdoapps@gmail.com",
  },
  {
    label: "GitHub",
    href: "https://github.com/dawsdo",
    display: "github.com/dawsdo",
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/dsdo",
    display: "linkedin.com/in/dsdo",
  },
];

export default function Contact() {
  const prefersReducedMotion = useReducedMotion();
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    setQuoteIndex(Math.floor(Math.random() * QUOTES.length));
  }, []);

  const initial = prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 };
  const inView = { opacity: 1, y: 0 };
  const t = (delay: number) => ({
    duration: 0.4,
    ease: EASE,
    delay: prefersReducedMotion ? 0 : delay,
  });
  const viewport = { once: true, amount: 0.2 } as const;

  return (
    <section
      id="contact"
      className="mx-auto max-w-[1280px] px-6 py-20 sm:px-10 sm:py-32 lg:px-16"
    >
      <motion.div
        initial={initial}
        whileInView={inView}
        viewport={viewport}
        transition={t(0)}
      >
        <h2 className="text-[28px] font-semibold leading-[1.2] tracking-[-0.6px] text-ink">
          Get in touch
        </h2>
        <p className="mt-2 text-sm leading-[1.5] text-ink-subtle">
          Reach out about internships, projects, or anything you&rsquo;re building.
        </p>
      </motion.div>

      <div className="mt-10 flex flex-col gap-5 lg:mt-12">
        {CONTACTS.map((item, i) => (
          <motion.div
            key={item.label}
            initial={initial}
            whileInView={inView}
            viewport={viewport}
            transition={t(0.08 + i * 0.06)}
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.05em] text-ink-tertiary">
              {item.label}
            </p>
            <Magnetic>
              <a
                href={item.href}
                className="mt-1 block text-lg font-medium text-ink transition duration-200 ease-linear-out hover:text-primary"
                {...(item.href.startsWith("mailto")
                  ? {}
                  : { target: "_blank", rel: "noopener noreferrer" })}
              >
                {item.display}
              </a>
            </Magnetic>
          </motion.div>
        ))}
      </div>

      <div className="mt-16 lg:mt-20">
        <p
          suppressHydrationWarning
          className="max-w-[62ch] font-mono text-xs italic leading-[1.4] text-ink-tertiary"
        >
          &ldquo;{QUOTES[quoteIndex].text}&rdquo; &mdash;{" "}
          {QUOTES[quoteIndex].attribution}
        </p>
        <p className="mt-8 font-mono text-xs text-ink-tertiary">
          &copy; 2026 Dawson Do. Built in Birmingham, probably learning something new right now.
          <span
            aria-hidden="true"
            className="hidden sm:inline-flex items-center align-middle ml-2"
          >
            <span
              className="relative inline-block overflow-hidden"
              style={{ width: "110px", height: "14px" }}
            >
              {/* Dots — fixed layer, Pac-Man renders on top via DOM order */}
              <svg
                className="absolute inset-0"
                viewBox="0 0 110 14"
                width="110"
                height="14"
              >
                <circle className="pacman-dot-1" cx="28" cy="7" r="2" fill="var(--color-primary)" opacity="0.4" />
                <circle className="pacman-dot-2" cx="48" cy="7" r="2" fill="var(--color-primary)" opacity="0.4" />
                <circle className="pacman-dot-3" cx="68" cy="7" r="2" fill="var(--color-primary)" opacity="0.4" />
              </svg>
              {/* Pac-Man — travels on top of dots */}
              <span
                className="pacman-mover absolute top-0 left-0"
                style={{ width: "14px", height: "14px" }}
              >
                <svg viewBox="0 0 14 14" width="14" height="14">
                  {/* Top jaw: pie slice from mouth-edge (10° above right) CCW to left.
                      The 10° baked opening means under reduced-motion (animation: none)
                      Pac-Man's mouth is naturally slightly open — no extra CSS needed. */}
                  <g className="pacman-jaw-top">
                    <path
                      d="M7,7 L13.89,5.79 A7,7 0 0,0 0,7 Z"
                      fill="var(--color-primary)"
                    />
                    <circle cx="9.5" cy="3.5" r="1" fill="var(--color-canvas)" />
                  </g>
                  {/* Bottom jaw: pie slice from mouth-edge (10° below right) CW to left */}
                  <path
                    className="pacman-jaw-bottom"
                    d="M7,7 L13.89,8.21 A7,7 0 0,1 0,7 Z"
                    fill="var(--color-primary)"
                  />
                </svg>
              </span>
            </span>
          </span>
        </p>
      </div>
    </section>
  );
}

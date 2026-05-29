"use client";

import { motion, useReducedMotion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

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
            <a
              href={item.href}
              className="mt-1 block text-lg font-medium text-ink transition duration-200 ease-linear-out hover:text-primary"
              {...(item.href.startsWith("mailto")
                ? {}
                : { target: "_blank", rel: "noopener noreferrer" })}
            >
              {item.display}
            </a>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

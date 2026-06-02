"use client";

import { Fragment } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

type MetricSegment = { text: string; emphasis?: boolean };
type Metric = MetricSegment[];

type Project = {
  slug: string;
  title: string;
  dates: string;
  description: string;
  metrics: Metric[];
  tags: string[];
};

const projects: Project[] = [
  {
    slug: "drone",
    title: "Collision Analysis Drone System",
    dates: "Jan 2026 – May 2026",
    description:
      "Real-time emergency response dashboard pairing DJI drones with YOLOv8 to support first-responder decisions at crash scenes.",
    metrics: [
      [
        { text: "92%", emphasis: true },
        { text: " detection accuracy" },
      ],
      [
        { text: "30+", emphasis: true },
        { text: " FPS" },
      ],
      [
        { text: "sub-100ms", emphasis: true },
        { text: " latency" },
      ],
    ],
    tags: ["Python", "YOLOv8", "OpenCV", "Roboflow", "Flask", "React"],
  },
  {
    slug: "seizure-diary",
    title: "Seizure Diary Platform",
    dates: "Jan 2026 – Apr 2026",
    description:
      "A health platform for patients to log structured seizure events.",
    metrics: [
      [{ text: "Per-user data isolation" }],
      [{ text: "Type-safe schemas" }],
      [{ text: "OAuth 2.0" }],
    ],
    tags: ["Next.js", "React", "PostgreSQL", "Prisma", "OAuth 2.0"],
  },
  {
    slug: "cloud-files",
    title: "AWS Cloud File Distribution",
    dates: "Mar 2025 – May 2025",
    description:
      "A serverless file-sharing system with tokenized S3 links and automated SES email delivery.",
    metrics: [
      [
        { text: "Eliminated " },
        { text: "100%", emphasis: true },
        { text: " of manual distribution overhead" },
      ],
    ],
    tags: ["Python", "Flask", "EC2", "AWS Lambda", "S3", "SES", "MySQL"],
  },
];

export default function SelectedWork() {
  const prefersReducedMotion = useReducedMotion();

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

  return (
    <section
      id="work"
      className="mx-auto max-w-[1280px] px-6 py-20 sm:px-10 sm:py-24 lg:px-16"
    >
      <motion.div
        initial={initial}
        whileInView={inView}
        viewport={viewport}
        transition={t(0)}
      >
        <h2 className="text-[28px] font-semibold leading-[1.2] tracking-[-0.6px] text-ink">
          Selected work
        </h2>
        <p className="mt-2 text-sm leading-[1.5] text-ink-subtle">
          Three projects from the last year, give or take.
        </p>
      </motion.div>

      <div className="mt-10 flex flex-col gap-6 lg:mt-12">
        {projects.map((project, i) => (
          <Link
            key={project.slug}
            href={`/projects/${project.slug}`}
            className="block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-focus"
          >
            <motion.article
              initial={initial}
              whileInView={inView}
              viewport={viewport}
              transition={t(0.08 + i * 0.1)}
              className="flex flex-col gap-6 rounded-lg border border-hairline bg-surface-1 p-8 transition duration-200 ease-linear-out hover:border-hairline-strong hover:bg-surface-2 motion-safe:hover:-translate-y-1 lg:p-10"
            >
              <header className="flex items-baseline justify-between gap-4">
                <h3 className="text-[22px] font-medium leading-[1.25] tracking-[-0.4px] text-ink">
                  {project.title}
                </h3>
                <span className="whitespace-nowrap font-mono text-xs text-ink-subtle">
                  {project.dates}
                </span>
              </header>

              <p className="max-w-[68ch] text-lg leading-[1.5] tracking-[-0.01em] text-ink-muted">
                {project.description}
              </p>

              {project.metrics.length > 0 && (
                <div className="text-xs leading-[1.4] text-ink-subtle">
                  {project.metrics.map((segments, mi) => (
                    <Fragment key={mi}>
                      {mi > 0 && (
                        <span className="mx-2 text-ink-tertiary" aria-hidden="true">
                          ·
                        </span>
                      )}
                      {segments.map((seg, si) => (
                        <span
                          key={si}
                          className={seg.emphasis ? "text-ink" : undefined}
                        >
                          {seg.text}
                        </span>
                      ))}
                    </Fragment>
                  ))}
                </div>
              )}

              <ul className="flex flex-wrap gap-1.5">
                {project.tags.map((tag) => (
                  <li
                    key={tag}
                    className="inline-flex items-center rounded-md border border-hairline bg-surface-2 px-2.5 py-1 text-xs text-ink-lavender"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            </motion.article>
          </Link>
        ))}
      </div>
    </section>
  );
}

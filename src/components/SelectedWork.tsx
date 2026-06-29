"use client";

import { Fragment } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Activity, Cloud, FileText, RadioTower } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as const;

export type MetricSegment = { text: string; emphasis?: boolean };
export type Metric = MetricSegment[];

export type ProjectCard = {
  slug: string;
  title: string;
  dates: string;
  description: string;
  metrics: Metric[];
  tags: string[];
};

type Props = { projects: ProjectCard[] };

function DronePreview() {
  return (
    <div className="relative h-full min-h-[220px] overflow-hidden rounded-lg bg-canvas p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(94,106,210,0.22),transparent_34%),radial-gradient(circle_at_70%_65%,rgba(39,166,68,0.12),transparent_30%)]" />
      <div className="relative flex h-full flex-col justify-between rounded-md border border-hairline bg-surface-1/80 p-4">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-2 rounded-md border border-hairline bg-surface-2 px-2.5 py-1 text-[11px] text-ink-muted">
            <RadioTower size={13} strokeWidth={1.75} />
            Live scene
          </span>
          <span className="font-mono text-[11px] text-success">30 FPS</span>
        </div>

        <div className="relative mx-auto aspect-video w-full max-w-[280px] rounded-md border border-hairline bg-surface-2">
          <div className="absolute left-[18%] top-[24%] h-[38%] w-[48%] rounded-sm border border-primary">
            <span className="absolute -top-5 left-0 font-mono text-[10px] text-primary-hover">
              vehicle 92%
            </span>
          </div>
          <div className="absolute bottom-3 right-3 h-7 w-16 rounded-sm border border-success/70" />
          <div className="absolute inset-x-4 bottom-4 h-px bg-hairline-strong" />
          <div className="absolute left-4 top-4 h-1.5 w-20 rounded-full bg-ink-tertiary/50" />
        </div>

        <div className="grid grid-cols-3 gap-2 text-center font-mono text-[10px] text-ink-subtle">
          <span className="rounded-md bg-surface-2 px-2 py-1">detect</span>
          <span className="rounded-md bg-surface-2 px-2 py-1">track</span>
          <span className="rounded-md bg-surface-2 px-2 py-1">alert</span>
        </div>
      </div>
    </div>
  );
}

function SeizureDiaryPreview() {
  const rows = [
    ["08:12", "Aura", "Low"],
    ["13:45", "Event", "Med"],
    ["21:03", "Sleep", "Stable"],
  ];

  return (
    <div className="h-full min-h-[220px] overflow-hidden rounded-lg bg-canvas p-4">
      <div className="flex h-full flex-col rounded-md border border-hairline bg-surface-1/80 p-4">
        <div className="flex items-center justify-between border-b border-hairline pb-3">
          <span className="inline-flex items-center gap-2 text-sm font-medium text-ink">
            <Activity size={15} strokeWidth={1.75} />
            Diary log
          </span>
          <span className="rounded-full bg-success/10 px-2 py-1 font-mono text-[10px] text-success">
            synced
          </span>
        </div>

        <div className="mt-4 grid gap-2">
          {rows.map(([time, label, status]) => (
            <div
              key={time}
              className="grid grid-cols-[44px_1fr_auto] items-center gap-3 rounded-md bg-surface-2 px-3 py-2"
            >
              <span className="font-mono text-[10px] text-ink-subtle">{time}</span>
              <span className="text-xs text-ink-muted">{label}</span>
              <span className="rounded-md border border-hairline px-2 py-0.5 text-[10px] text-ink-lavender">
                {status}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-auto grid grid-cols-7 gap-1 pt-5">
          {Array.from({ length: 21 }).map((_, i) => (
            <span
              key={i}
              className={[
                "h-5 rounded-sm",
                i % 5 === 0
                  ? "bg-primary/80"
                  : i % 3 === 0
                    ? "bg-primary/35"
                    : "bg-surface-2",
              ].join(" ")}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function CloudFilesPreview() {
  return (
    <div className="h-full min-h-[220px] overflow-hidden rounded-lg bg-canvas p-4">
      <div className="flex h-full flex-col justify-center rounded-md border border-hairline bg-surface-1/80 p-4">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          <div className="rounded-md bg-surface-2 p-3">
            <FileText size={18} strokeWidth={1.75} className="text-ink-muted" />
            <div className="mt-3 h-1.5 w-16 rounded-full bg-ink-tertiary/50" />
            <div className="mt-2 h-1.5 w-10 rounded-full bg-ink-tertiary/35" />
          </div>
          <div className="h-px w-10 bg-hairline-strong" />
          <div className="rounded-md bg-surface-2 p-3">
            <Cloud size={18} strokeWidth={1.75} className="text-primary-hover" />
            <div className="mt-3 h-1.5 w-16 rounded-full bg-primary/60" />
            <div className="mt-2 h-1.5 w-10 rounded-full bg-primary/30" />
          </div>
        </div>

        <div className="mt-5 rounded-md border border-hairline bg-surface-2 p-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-ink-subtle">signed URL</span>
            <span className="font-mono text-[10px] text-success">sent</span>
          </div>
          <div className="mt-3 h-1.5 rounded-full bg-hairline">
            <div className="h-1.5 w-4/5 rounded-full bg-primary" />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 text-center font-mono text-[10px] text-ink-subtle">
          <span className="rounded-md bg-surface-2 px-2 py-1">S3</span>
          <span className="rounded-md bg-surface-2 px-2 py-1">SES</span>
          <span className="rounded-md bg-surface-2 px-2 py-1">Lambda</span>
        </div>
      </div>
    </div>
  );
}

function ProjectPreview({ slug }: { slug: string }) {
  if (slug === "drone") {
    return <DronePreview />;
  }

  if (slug === "seizure-diary") {
    return <SeizureDiaryPreview />;
  }

  return <CloudFilesPreview />;
}

export default function SelectedWork({ projects }: Props) {
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
              transition={t(0.05 + i * 0.05)}
              className="grid gap-6 rounded-lg border border-hairline bg-surface-1 p-6 transition duration-200 ease-linear-out hover:border-hairline-strong hover:bg-surface-2 motion-safe:hover:-translate-y-1 sm:p-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10 lg:p-10"
            >
              <div className="flex flex-col gap-6">
                <header className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
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
              </div>

              <div aria-hidden="true">
                <ProjectPreview slug={project.slug} />
              </div>
            </motion.article>
          </Link>
        ))}
      </div>
    </section>
  );
}

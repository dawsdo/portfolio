import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Experience — Dawson Do",
  description: "Work history and internship experience.",
};

export default function ExperiencePage() {
  return (
    <main className="mx-auto max-w-[1280px] px-6 py-24 sm:px-10 sm:py-32 lg:px-16">
      <div className="max-w-[640px]">
        <p className="mb-4 font-mono text-xs uppercase tracking-widest text-ink-tertiary">
          Experience
        </p>
        <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-ink">
          Work history
        </h1>
        {/* TODO: Add work history entries here */}
        <p className="mt-6 text-lg leading-[1.5] text-ink-muted">
          Coming soon.
        </p>
      </div>
    </main>
  );
}

import fs from "fs";
import path from "path";
import Link from "next/link";

const PROJECT_SLUGS = ["drone", "seizure-diary", "cloud-files"] as const;
type Slug = (typeof PROJECT_SLUGS)[number];

type Meta = {
  slug: string;
  title: string;
  status: "published" | "stub";
};

function getNavMeta(slug: string): Meta | null {
  try {
    const filePath = path.join(
      process.cwd(),
      "content",
      "projects",
      `${slug}.json`
    );
    const raw = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    return { slug: raw.slug, title: raw.title, status: raw.status };
  } catch {
    return null;
  }
}

export function CaseStudyNav({ currentSlug }: { currentSlug: string }) {
  const n = PROJECT_SLUGS.length;
  const idx = PROJECT_SLUGS.indexOf(currentSlug as Slug);
  if (idx === -1) return null;

  const prevSlug = PROJECT_SLUGS[(idx - 1 + n) % n];
  const nextSlug = PROJECT_SLUGS[(idx + 1) % n];

  const prev = getNavMeta(prevSlug);
  const next = getNavMeta(nextSlug);

  if (!prev || !next) return null;

  return (
    <nav
      aria-label="Case study navigation"
      className="mx-auto max-w-[720px] px-6 sm:px-10 lg:px-16"
    >
      <hr className="border-0 border-t border-hairline" />
      <div className="flex items-start justify-between gap-6 pb-24 pt-8">
        {/* Previous */}
        <Link
          href={`/projects/${prev.slug}`}
          aria-label={`Previous case study: ${prev.title}`}
          className="cs-nav-prev inline-flex max-w-[45%] flex-col rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-focus"
        >
          <span className="font-mono text-[12px] tracking-[0.05em] text-ink-subtle">
            Previous
          </span>
          <span className="cs-nav-link-title mt-2 flex items-baseline gap-1.5 text-[18px] font-medium leading-snug tracking-[-0.01em] text-ink">
            <span className="cs-nav-arrow shrink-0">←</span>
            <span>
              {prev.title}
              {prev.status === "stub" && (
                <span className="ml-1.5 text-sm font-normal !text-ink-tertiary">
                  (coming soon)
                </span>
              )}
            </span>
          </span>
        </Link>

        {/* Next */}
        <Link
          href={`/projects/${next.slug}`}
          aria-label={`Next case study: ${next.title}`}
          className="cs-nav-next inline-flex max-w-[45%] flex-col items-end rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-focus"
        >
          <span className="font-mono text-[12px] tracking-[0.05em] text-ink-subtle">
            Next
          </span>
          <span className="cs-nav-link-title mt-2 flex items-baseline gap-1.5 text-right text-[18px] font-medium leading-snug tracking-[-0.01em] text-ink">
            <span>
              {next.title}
              {next.status === "stub" && (
                <span className="ml-1.5 text-sm font-normal !text-ink-tertiary">
                  (coming soon)
                </span>
              )}
            </span>
            <span className="cs-nav-arrow shrink-0">→</span>
          </span>
        </Link>
      </div>
    </nav>
  );
}

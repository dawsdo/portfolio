import fs from "fs";
import path from "path";
import { CaseStudyNavLink } from "./CaseStudyNavLink";

const PROJECT_SLUGS = ["drone", "seizure-diary", "cloud-files"] as const;
type Slug = (typeof PROJECT_SLUGS)[number];

type Meta = {
  slug: string;
  title: string;
  description: string;
  tags: string[];
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
    return {
      slug: raw.slug,
      title: raw.title,
      description: raw.description ?? "",
      tags: Array.isArray(raw.tags) ? raw.tags : [],
      status: raw.status,
    };
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
        <CaseStudyNavLink direction="prev" {...prev} />
        <CaseStudyNavLink direction="next" {...next} />
      </div>
    </nav>
  );
}

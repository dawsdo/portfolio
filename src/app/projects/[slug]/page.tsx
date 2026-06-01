import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { CaseStudyNav } from "@/components/CaseStudyNav";

type ProjectMeta = {
  slug: string;
  title: string;
  dates: string;
  context: string;
  tags: string[];
  metrics: string;
  description: string;
  status: "published" | "stub";
};

const PROJECT_ORDER = ["drone", "seizure-diary", "cloud-files"] as const;

function getMeta(slug: string): ProjectMeta | null {
  try {
    const filePath = path.join(
      process.cwd(),
      "content",
      "projects",
      `${slug}.json`
    );
    return JSON.parse(fs.readFileSync(filePath, "utf-8")) as ProjectMeta;
  } catch {
    return null;
  }
}

function getMDXSource(slug: string): string | null {
  try {
    const filePath = path.join(
      process.cwd(),
      "content",
      "projects",
      `${slug}.mdx`
    );
    return fs.readFileSync(filePath, "utf-8");
  } catch {
    return null;
  }
}

const mdxComponents = {
  h2: ({ children }: { children: React.ReactNode }) => (
    <h2 className="mt-10 mb-4 text-[22px] font-medium leading-[1.25] tracking-[-0.4px] text-ink">
      {children}
    </h2>
  ),
  h3: ({ children }: { children: React.ReactNode }) => (
    <h3 className="mt-8 mb-3 text-lg font-medium leading-[1.4] tracking-[-0.01em] text-ink">
      {children}
    </h3>
  ),
  p: ({ children }: { children: React.ReactNode }) => (
    <p className="mb-6 text-lg leading-[1.5] tracking-[-0.01em] text-ink-muted">
      {children}
    </p>
  ),
  a: ({
    href,
    children,
  }: {
    href?: string;
    children: React.ReactNode;
  }) => (
    <a
      href={href}
      className="text-primary underline underline-offset-2 transition-colors duration-200 ease-linear-out hover:text-primary-hover"
    >
      {children}
    </a>
  ),
  ul: ({ children }: { children: React.ReactNode }) => (
    <ul className="mb-6 list-disc space-y-2 pl-6 text-lg leading-[1.5] tracking-[-0.01em] text-ink-muted">
      {children}
    </ul>
  ),
  ol: ({ children }: { children: React.ReactNode }) => (
    <ol className="mb-6 list-decimal space-y-2 pl-6 text-lg leading-[1.5] tracking-[-0.01em] text-ink-muted">
      {children}
    </ol>
  ),
  code: ({ children }: { children: React.ReactNode }) => (
    <code className="rounded border border-hairline bg-surface-2 px-1.5 py-0.5 font-mono text-[13px] text-ink-muted">
      {children}
    </code>
  ),
  blockquote: ({ children }: { children: React.ReactNode }) => (
    <blockquote className="mb-6 border-l-2 border-hairline-strong pl-4 italic text-ink-subtle">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-8 border-0 border-t border-hairline" />,
  strong: ({ children }: { children: React.ReactNode }) => (
    <strong className="font-semibold text-ink">{children}</strong>
  ),
};

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return PROJECT_ORDER.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const meta = getMeta(slug);
  if (!meta) return {};
  return {
    title: `${meta.title} — Dawson Do`,
    description: meta.description,
    openGraph: {
      title: `${meta.title} — Dawson Do`,
      description: meta.description,
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const meta = getMeta(slug);
  if (!meta) return notFound();

  const source = getMDXSource(slug);

  return (
    <main>
      {/* Back link */}
      <nav className="mx-auto max-w-[960px] px-6 pt-8 sm:px-10 sm:pt-10 lg:px-16">
        <Link
          href="/#work"
          className="inline-flex items-center gap-1.5 rounded-sm text-sm text-ink-subtle transition-colors duration-200 ease-linear-out hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-focus"
        >
          ← Back to all work
        </Link>
      </nav>

      {/* Project hero */}
      <header className="mx-auto max-w-[960px] px-6 pb-10 pt-10 sm:px-10 lg:px-16">
        <h1 className="text-[40px] font-semibold leading-[1.15] tracking-[-1.0px] text-ink">
          {meta.title}
        </h1>
        <p className="mt-3 font-mono text-xs text-ink-subtle">
          {meta.dates} · {meta.context}
        </p>
        <ul
          className="mt-5 flex flex-wrap gap-1.5"
          aria-label="Technologies used"
        >
          {meta.tags.map((tag) => (
            <li
              key={tag}
              className="inline-flex items-center rounded-md border border-hairline bg-surface-2 px-2.5 py-1 text-xs text-ink-lavender"
            >
              {tag}
            </li>
          ))}
        </ul>
      </header>

      {/* Divider */}
      <div className="mx-auto max-w-[960px] px-6 sm:px-10 lg:px-16">
        <hr className="border-0 border-t border-hairline" />
      </div>

      {/* Prose */}
      <article className="mx-auto max-w-[720px] px-6 py-12 sm:px-10 sm:py-16 lg:px-16">
        {source ? (
          <MDXRemote source={source} components={mdxComponents} />
        ) : (
          <p className="text-lg text-ink-subtle">Content not found.</p>
        )}
      </article>

      <CaseStudyNav currentSlug={slug} />
    </main>
  );
}

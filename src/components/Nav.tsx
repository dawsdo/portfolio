"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  House,
  User,
  FolderOpen,
  Briefcase,
  Mail,
  ExternalLink,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const NAV_LINKS: { label: string; href: string; Icon: LucideIcon }[] = [
  { label: "Home", href: "/", Icon: House },
  { label: "About", href: "/about", Icon: User },
  { label: "Projects", href: "/projects", Icon: FolderOpen },
  { label: "Experience", href: "/experience", Icon: Briefcase },
  { label: "Contact", href: "/contact", Icon: Mail },
];

const RESUME_HREF = "/resume.pdf";

const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-hairline bg-canvas/85 backdrop-blur-sm">
      {/* Desktop — 3-column grid: wordmark | links | resume */}
      <div className="mx-auto hidden max-w-[1280px] grid-cols-[1fr_auto_1fr] items-center px-6 py-3.5 sm:grid sm:px-10 lg:px-16">
        {/* Left: wordmark */}
        <Link
          href="/"
          className="justify-self-start font-mono text-sm font-medium text-ink transition-colors hover:text-ink-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-focus"
        >
          Dawson Do
        </Link>

        {/* Center: nav links */}
        <nav aria-label="Site navigation">
          <ul className="flex items-center gap-1" role="list">
            {NAV_LINKS.map(({ label, href, Icon }) => {
              const active = isActive(href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={[
                      "group flex items-center gap-[5px] rounded-md px-3 py-1.5 text-sm transition-colors",
                      "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-focus",
                      active
                        ? "text-primary"
                        : "text-ink-muted hover:text-ink",
                    ].join(" ")}
                  >
                    {/* Icon — space always reserved, opacity animated */}
                    <span
                      aria-hidden="true"
                      className={[
                        "flex items-center",
                        "opacity-0 motion-safe:transition-[opacity,transform]",
                        `motion-safe:duration-200`,
                        "group-hover:opacity-100 group-focus-visible:opacity-100",
                        "motion-safe:translate-x-[-3px] motion-safe:group-hover:translate-x-0 motion-safe:group-focus-visible:translate-x-0",
                        active ? "opacity-100 translate-x-0" : "",
                      ].join(" ")}
                      style={{ transitionTimingFunction: EASE }}
                    >
                      <Icon size={13} strokeWidth={1.75} />
                    </span>
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Right: Resume */}
        <div className="justify-self-end">
          <a
            href={RESUME_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-[5px] rounded-md border border-hairline px-3 py-1.5 text-sm text-ink-muted transition-colors hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-focus"
          >
            <span
              aria-hidden="true"
              className="flex items-center opacity-0 motion-safe:translate-x-[-3px] motion-safe:transition-[opacity,transform] motion-safe:duration-200 group-hover:opacity-100 group-hover:translate-x-0 group-focus-visible:opacity-100 group-focus-visible:translate-x-0"
              style={{ transitionTimingFunction: EASE }}
            >
              <ExternalLink size={13} strokeWidth={1.75} />
            </span>
            Resume
          </a>
        </div>
      </div>

      {/* Mobile — wordmark + hamburger */}
      <div className="flex items-center justify-between px-6 py-3.5 sm:hidden">
        <Link
          href="/"
          className="font-mono text-sm font-medium text-ink transition-colors hover:text-ink-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-focus"
        >
          Dawson Do
        </Link>

        <button
          type="button"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center rounded-md text-ink-muted transition-colors hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-focus"
        >
          {open ? (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="M3 3L15 15M15 3L3 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="M2 5H16M2 9H16M2 13H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu — icons always visible alongside labels */}
      <div
        id="mobile-nav"
        aria-hidden={!open}
        className={`overflow-hidden border-t border-hairline sm:hidden motion-safe:transition-all motion-safe:duration-200 ${
          open ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        }`}
        style={{ transitionTimingFunction: EASE }}
      >
        <nav aria-label="Mobile site navigation">
          <ul className="flex flex-col px-6 py-2" role="list">
            {NAV_LINKS.map(({ label, href, Icon }) => {
              const active = isActive(href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setOpen(false)}
                    className={[
                      "flex items-center gap-2.5 py-2.5 text-sm transition-colors",
                      "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-focus",
                      active ? "text-primary" : "text-ink-muted hover:text-ink",
                    ].join(" ")}
                  >
                    <Icon size={14} strokeWidth={1.75} aria-hidden="true" />
                    {label}
                  </Link>
                </li>
              );
            })}
            <li>
              <a
                href={RESUME_HREF}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 py-2.5 text-sm text-ink-muted transition-colors hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-focus"
              >
                <ExternalLink size={14} strokeWidth={1.75} aria-hidden="true" />
                Resume
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

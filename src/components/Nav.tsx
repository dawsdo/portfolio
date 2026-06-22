"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "Experience", href: "/experience" },
  { label: "Contact", href: "/contact" },
] as const;

const RESUME_HREF = "/resume.pdf";

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const desktopLinkClass = (href: string) =>
    `px-3 py-1.5 rounded-md text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-focus ${
      isActive(href) ? "text-ink" : "text-ink-muted hover:text-ink"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-hairline bg-canvas/85 backdrop-blur-sm">
      <nav
        className="mx-auto flex max-w-[1280px] items-center justify-between px-6 py-3.5 sm:px-10 lg:px-16"
        aria-label="Site navigation"
      >
        <Link
          href="/"
          className="font-mono text-sm font-medium text-ink transition-colors hover:text-ink-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-focus"
        >
          DD
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-1 sm:flex" role="list">
          {NAV_LINKS.map(({ label, href }) => (
            <li key={href}>
              <Link
                href={href}
                aria-current={isActive(href) ? "page" : undefined}
                className={desktopLinkClass(href)}
              >
                {label}
              </Link>
            </li>
          ))}
          <li>
            <a
              href={RESUME_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 rounded-md border border-hairline px-3 py-1.5 text-sm text-ink-muted transition-colors hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-focus"
            >
              Resume ↗
            </a>
          </li>
        </ul>

        {/* Mobile hamburger */}
        <button
          type="button"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center rounded-md text-ink-muted transition-colors hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-focus sm:hidden"
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
      </nav>

      {/* Mobile menu */}
      <div
        id="mobile-nav"
        aria-hidden={!open}
        className={`overflow-hidden border-t border-hairline sm:hidden motion-safe:transition-all motion-safe:duration-200 ${
          open ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <ul className="flex flex-col px-6 py-2" role="list">
          {NAV_LINKS.map(({ label, href }) => (
            <li key={href}>
              <Link
                href={href}
                aria-current={isActive(href) ? "page" : undefined}
                onClick={() => setOpen(false)}
                className={`flex py-2.5 text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-focus ${
                  isActive(href) ? "text-ink" : "text-ink-muted hover:text-ink"
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
          <li>
            <a
              href={RESUME_HREF}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="flex py-2.5 text-sm text-ink-muted transition-colors hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-focus"
            >
              Resume ↗
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}

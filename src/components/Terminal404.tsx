"use client";

import { useState, useRef, useEffect, useId } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useReducedMotion } from "framer-motion";

type HistoryEntry =
  | { kind: "input"; value: string }
  | { kind: "output"; text: string; variant?: "error" | "success" | "muted" };

const ROUTES = [
  { num: 1, name: "home",       path: "/",           label: "home",       external: false },
  { num: 2, name: "about",      path: "/about",      label: "about",      external: false },
  { num: 3, name: "projects",   path: "/projects",   label: "projects",   external: false },
  { num: 4, name: "experience", path: "/experience", label: "experience", external: false },
  { num: 5, name: "contact",    path: "/contact",    label: "contact",    external: false },
  { num: 6, name: "resume",     path: "/resume.pdf", label: "resume",     external: true  },
] as const;

type Route = (typeof ROUTES)[number];

const ROUTE_MAP = new Map<string, Route>(
  ROUTES.flatMap((r) => [[String(r.num), r], [r.name, r]])
);

function resolveRoute(raw: string): Route | undefined {
  const trimmed = raw.trim().toLowerCase();
  const cdMatch = trimmed.match(/^cd\s+(.+)$/);
  if (cdMatch) return ROUTE_MAP.get(cdMatch[1].trim());
  return ROUTE_MAP.get(trimmed);
}

export default function Terminal404() {
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [announcement, setAnnouncement] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputId = useId();

  useEffect(() => {
    if (!prefersReducedMotion) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [history, prefersReducedMotion]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const raw = input.trim();
    if (!raw) return;

    const base: HistoryEntry[] = [...history, { kind: "input", value: raw }];
    const lower = raw.toLowerCase();

    if (lower === "ls" || lower === "help") {
      const text = ROUTES.map((r) => `  ${r.num}  ${r.name}`).join("\n");
      setHistory([...base, { kind: "output", text, variant: "muted" }]);
      setAnnouncement(text);
      setInput("");
      return;
    }

    const route = resolveRoute(raw);
    if (route) {
      const text = `navigating to ${route.path}…`;
      setHistory([...base, { kind: "output", text, variant: "success" }]);
      setAnnouncement(text);
      setInput("");
      if (route.external) {
        window.open(route.path, "_blank", "noopener,noreferrer");
      } else {
        router.push(route.path);
      }
      return;
    }

    const text = `command not found: ${raw}`;
    setHistory([...base, { kind: "output", text, variant: "error" }]);
    setAnnouncement(text);
    setInput("");
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-20">
      <h1 className="sr-only">404 — Page not found</h1>

      {/* Announces command output to screen readers without duplicating visible history */}
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {announcement}
      </div>

      <div className="w-full max-w-xl">
        <div className="overflow-hidden rounded-xl border border-hairline bg-surface-1">
          {/* macOS title bar */}
          <div className="flex items-center border-b border-hairline bg-surface-2 px-4 py-3">
            <div className="flex items-center gap-1.5" aria-hidden="true">
              <span className="block h-3 w-3 rounded-full bg-[#FF5F57]" />
              <span className="block h-3 w-3 rounded-full bg-[#FEBC2E]" />
              <span className="block h-3 w-3 rounded-full bg-[#28C840]" />
            </div>
            <span className="flex-1 text-center font-mono text-xs text-ink-subtle">
              dawson@portfolio — 404
            </span>
          </div>

          {/* Terminal body */}
          <div
            className="min-h-64 cursor-text p-5 font-mono text-sm leading-relaxed"
            onClick={() => inputRef.current?.focus()}
          >
            {/* Script header */}
            <p className="text-ink-subtle">$ ./find-page.sh</p>
            <p className="text-ink-subtle">searching…</p>
            <p className="mt-1 text-[#e85b4a]">error: 404 — route not found</p>

            {/* Route list — always visible, always keyboard/click navigable */}
            <p className="mt-4 text-ink-muted">available routes:</p>
            <nav aria-label="Site pages">
              <ol className="mt-2 list-none space-y-1.5">
                {ROUTES.map((route) => (
                  <li key={route.num} className="flex items-center gap-3">
                    <span
                      className="w-4 select-none text-right text-primary"
                      aria-hidden="true"
                    >
                      {route.num}
                    </span>
                    {route.external ? (
                      <a
                        href={route.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-sm text-ink transition-colors duration-150 hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary-focus"
                      >
                        {route.label}
                        <span className="sr-only"> (opens in new tab)</span>
                      </a>
                    ) : (
                      <Link
                        href={route.path}
                        className="rounded-sm text-ink transition-colors duration-150 hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary-focus"
                      >
                        {route.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ol>
            </nav>

            {/* Visual command history — hidden from screen readers; live region handles AT output */}
            {history.length > 0 && (
              <div className="mt-4 space-y-1" aria-hidden="true">
                {history.map((entry, i) =>
                  entry.kind === "input" ? (
                    <p key={i} className="text-ink-subtle">
                      <span className="text-primary">$</span> {entry.value}
                    </p>
                  ) : (
                    <p
                      key={i}
                      className={[
                        "whitespace-pre",
                        entry.variant === "error"
                          ? "text-[#e85b4a]"
                          : entry.variant === "success"
                          ? "text-success"
                          : "text-ink-subtle",
                      ].join(" ")}
                    >
                      {entry.text}
                    </p>
                  )
                )}
              </div>
            )}

            {/* Command input */}
            <form onSubmit={handleSubmit} className="mt-4 flex items-center gap-2">
              <label htmlFor={inputId} className="sr-only">
                Type a number 1–6 or a page name and press Enter to navigate. Type ls or help to list routes.
              </label>
              <span className="select-none text-primary" aria-hidden="true">$</span>
              <input
                id={inputId}
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                autoFocus
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
                className="flex-1 bg-transparent text-ink caret-primary outline-none placeholder:text-ink-tertiary"
                placeholder="type a number or name…"
              />
            </form>

            <div ref={bottomRef} aria-hidden="true" />
          </div>
        </div>
      </div>
    </main>
  );
}

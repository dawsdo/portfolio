"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const STORAGE_KEY = "portfolio-feedback-dismissed";
const FORMSPREE_URL = "https://formspree.io/f/mdavobdw";
const EASE = [0.16, 1, 0.3, 1] as const;

type WidgetState = "idle" | "prompt" | "form" | "success";

export default function FeedbackWidget() {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();

  const [state, setState] = useState<WidgetState>("idle");
  const [eligible, setEligible] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Never show on 404 or any case study page
  const isExcluded =
    pathname === "/not-found" || pathname.startsWith("/projects/");

  const getDismissed = () => {
    try {
      return localStorage.getItem(STORAGE_KEY) === "true";
    } catch {
      return false;
    }
  };

  const setDismissed = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {}
  };

  const dismiss = () => {
    setDismissed();
    setState("idle");
  };

  // Watch for user scrolling past the #work section
  useEffect(() => {
    if (isExcluded || getDismissed()) return;

    const workEl = document.getElementById("work");
    if (!workEl) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Section has scrolled above the viewport
        if (!entry.isIntersecting && entry.boundingClientRect.top < 0) {
          setEligible(true);
          observer.disconnect();
        }
      },
      { threshold: 0 }
    );

    observer.observe(workEl);
    return () => observer.disconnect();
  }, [isExcluded, pathname]);

  // Show widget 2 seconds after becoming eligible
  useEffect(() => {
    if (!eligible || isExcluded || getDismissed()) return;
    const timer = setTimeout(() => setState("prompt"), 2000);
    return () => clearTimeout(timer);
  }, [eligible, isExcluded]);

  // ESC dismisses state 1 or 2 (and persists the flag)
  useEffect(() => {
    if (state !== "prompt" && state !== "form") return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [state]);

  // Auto-focus textarea when form expands
  useEffect(() => {
    if (state !== "form") return;
    const t = setTimeout(() => textareaRef.current?.focus(), 50);
    return () => clearTimeout(t);
  }, [state]);

  // Auto-dismiss 2 seconds after success confirmation
  useEffect(() => {
    if (state !== "success") return;
    const timer = setTimeout(() => setState("idle"), 2000);
    return () => clearTimeout(timer);
  }, [state]);

  const handleSubmit = async () => {
    if (!feedback.trim() || submitting) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch(FORMSPREE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          feedback,
          name,
          email,
          page: window.location.href,
        }),
      });
      if (res.ok) {
        setDismissed();
        setState("success");
      } else {
        setError("Couldn't send — try again?");
      }
    } catch {
      setError("Couldn't send — try again?");
    } finally {
      setSubmitting(false);
    }
  };

  if (isExcluded) return null;

  const cardInitial = prefersReducedMotion
    ? { y: 0, opacity: 1 }
    : { y: 20, opacity: 0 };

  const cardTransition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.3, ease: EASE };

  const inputClass =
    "w-full rounded-md border border-hairline bg-surface-3 px-3 py-2 text-sm text-ink placeholder:text-ink-tertiary focus:outline-none focus:ring-2 focus:ring-primary-focus";

  const btnPrimary =
    "rounded-md bg-primary px-3.5 py-2 text-sm font-medium text-white transition hover:bg-primary-hover disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-focus";

  const btnGhost =
    "rounded-md px-3.5 py-2 text-sm font-medium text-ink-muted transition hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-focus";

  return (
    <AnimatePresence>
      {state !== "idle" && (
        <motion.div
          key="feedback-widget"
          role="dialog"
          aria-labelledby="feedback-heading"
          initial={cardInitial}
          animate={{ y: 0, opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={cardTransition}
          className="fixed bottom-4 left-4 right-4 z-[60] sm:bottom-6 sm:left-auto sm:right-6 sm:w-80"
        >
          <div className="rounded-lg border border-hairline bg-surface-2 p-5">

            {/* ── State 3: Success ── */}
            {state === "success" && (
              <p className="py-1 text-center text-sm text-ink">
                Thanks. Really helpful.
              </p>
            )}

            {/* ── State 2: Form ── */}
            {state === "form" && (
              <div className="flex flex-col gap-3">
                <h2
                  id="feedback-heading"
                  className="text-base font-medium leading-[1.25] tracking-[-0.2px] text-ink"
                >
                  What stood out? What didn&rsquo;t?
                </h2>

                <textarea
                  ref={textareaRef}
                  rows={4}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Anything that came to mind..."
                  className={`${inputClass} resize-none`}
                />

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name (optional)"
                  className={inputClass}
                />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email if you'd like a reply (optional)"
                  className={inputClass}
                />

                {error && (
                  <p className="text-xs text-ink-tertiary">{error}</p>
                )}

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={submitting || !feedback.trim()}
                    className={btnPrimary}
                  >
                    {submitting ? "Sending…" : "Send"}
                  </button>
                  <button
                    type="button"
                    aria-label="Cancel feedback and return to prompt"
                    onClick={() => setState("prompt")}
                    className={btnGhost}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* ── State 1: Prompt ── */}
            {state === "prompt" && (
              <>
                <p
                  id="feedback-heading"
                  className="mb-2 font-mono text-xs text-ink-tertiary"
                >
                  Feedback
                </p>
                <p className="text-base leading-[1.5] tracking-[-0.05px] text-ink">
                  Curious what you think of this so far. If something didn&rsquo;t work, was confusing, or felt missing, I&rsquo;d love to know.
                </p>
                <div className="mt-5 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setState("form")}
                    className={btnPrimary}
                  >
                    Send feedback
                  </button>
                  <button
                    type="button"
                    aria-label="No thanks, dismiss feedback widget"
                    onClick={dismiss}
                    className={btnGhost}
                  >
                    No thanks
                  </button>
                </div>
              </>
            )}

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

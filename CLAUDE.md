\# Dawson Do — Portfolio



\## About the owner

\- CS student at UAB (BS Computer Science, Minor in Chemistry \& Math, expected April 2027). 4.0 GPA, on-track for Distinguished Honors \& Summa Cum Laude.

\- Stack-strong across systems (C++, Go, OCaml, Assembly), full-stack web (Next.js, React, Flask, PostgreSQL, Prisma), AWS (EC2/S3/Lambda/RDS/SES), and applied ML/CV (YOLOv8, OpenCV, Scikit-learn).

- Personality of the site: visually restrained and precise (Linear/Vercel/Warp territory), but the WRITING voice is warm and curious. This contrast is intentional — austere structure, human words. Dawson is a curious "lifetime student" who likes puzzles, sports, working out, and finding hole-in-the-wall food spots. The visuals shouldn't be cold, the copy shouldn't be corporate.



\## Stack

\- Next.js 16 (App Router), TypeScript, Tailwind CSS v4, React 19

\- Framer Motion for animation

\- Geist Sans + Geist Mono (already shipped with Next.js scaffold)

\- Deployed to Vercel



\## Design system — MANDATORY

\- \*\*Always read `DESIGN.md` at project root before any UI work.\*\* It captures Linear's design system. Match those tokens (colors, typography, spacing, radii) exactly. Do not invent colors or sizes.

\- Canvas color is `#010102` (not pure black — note the faint blue tint).

\- Single accent: lavender-blue `#5e6ad2` — reserved for the primary CTA, brand mark, focus rings, and link emphasis. Never use lavender as a background or fill.

\- Four-step surface ladder (canvas → surface-1 → surface-2 → surface-3 → surface-4) carries hierarchy. No drop shadows on dark surfaces.

\- Typography: Geist Sans at weight 600 for display, 500 for card titles and buttons, 400 for body. Aggressive negative letter-spacing on display (-3.0px at 80px). Body holds at -0.05px.

\- Radii: 8px (`rounded-md`) for buttons and inputs. 12px (`rounded-lg`) for cards. 16px (`rounded-xl`) for product/project screenshot panels. Never pill-round CTAs.



\## ui-ux-pro-max skill

\- Activate the skill for layout planning and pre-delivery quality checks on any new page or major component.

\- The skill has its own opinions; when its recommendations conflict with DESIGN.md, \*\*DESIGN.md wins\*\*. Re-read DESIGN.md if drift is detected.



\## Higgsfield MCP

\- Connected and available for generating hero / section background images.

\- Use \*\*sparingly\*\* — atmospheric, abstract, dark gradients only. Never AI-generated photos of people, never stock-art-style imagery, never anything that reads as "AI image."

\- Save generated assets to `/public/generated/` with descriptive filenames (e.g. `hero-bg.webp`, `drone-cover.webp`). Prefer `.webp` for size.

\- Confirm with me before generating a new asset — don't burn credits on iteration without checking in.



\## Motion conventions

\- Single easing curve everywhere: `cubic-bezier(0.16, 1, 0.3, 1)`

\- Default duration: 250ms. Page transitions: 400ms. Never exceed 600ms.

\- Respect `prefers-reduced-motion` on every animated element.

\- Stagger lists at 40–60ms.



\## Sections on the homepage

1\. \*\*Hero\*\* — Name, one-line description, two CTAs. Subtle interactive accent (TBD — leaning toward a low-key pulse/beat indicator).

2\. \*\*About\*\* — 3–4 sentences. Possibly a small photo.

3\. \*\*Selected work\*\* — Three project case study cards: Collision Analysis Drone, Seizure Diary Platform, AWS Cloud File Distribution App.

4. **How I build** — Animated node-graph showpiece (inspired by VoltAgent's interactive graph). Inputs (a problem / an idea / a dataset) flow into a central hub (Dawson) and out to outputs (web apps, ML systems, cloud infrastructure), with capability chips along the bottom (Python, Go, React, AWS, Computer Vision). Light pulses travel the wires. Build this as a REUSABLE component — the same graph gets reused on the drone project page with real architecture nodes (DJI Tello → Flask API → YOLOv8 → React dashboard).
5. **Stack** — Horizontal dual-row infinite-scroll marquee of tech logos on a dotted dark background, rows scrolling opposite directions, edges faded. Inspired by VoltAgent's "used and tested by" ribbon but with Dawson's tech stack instead of company logos.

5\. \*\*Contact\*\* — Email, GitHub, LinkedIn.



\## Project case studies

Each project gets a dedicated route at `/projects/\[slug]` (MDX). For now we'll just stub the cards on the homepage and fill in case study content later.



\## Constraints

\- Lighthouse 95+ across performance, accessibility, best practices, SEO.

\- WCAG AA minimum (color contrast, focus visibility, keyboard nav, alt text).

\- The site MUST be readable and fully functional with JavaScript disabled where possible (degrade gracefully).

\- No tracking, no analytics, no cookies on V1.



\## Out of scope for V1

\- Blog

\- Dark/light theme toggle (Linear marketing is dark-only — match that)

\- Real-time anything (websockets, comments, etc.)

\- A CMS



\## Anti-patterns to refuse

\- Generic glassmorphism / blurred-card "AI portfolio" aesthetic.

\- Three-column "Skills/Projects/About" hero with floating cards.

\- Animated typing-effect text in the hero.

\- Emoji-led section headers.

\- "Buy me a coffee" widgets, view counters, or any maximalist marketing chrome.

\- Light mode.


---
version: 1.1
name: Eduardo Serrano Portfolio, "Production grade"
description: Dark-first developer portfolio for big-tech recruiters and engineering managers. Near-black canvas, one signal-orange accent used scarcely at element level and once as a full band, condensed heavy display type (Archivo, wdth 75) over a calm grotesque body, and Martian Mono as the voice for system facts. Structure inspired by the ClickHouse DESIGN.md from awesome-design-md (flat surfaces, hairlines, no shadows, real technical artifacts inside dark cards). Light theme is a full, equal citizen.

design_read: "Developer portfolio for technical recruiters and engineering managers at large companies, with a dark, engineered, production-grade language, leaning toward Astro + Tailwind v4 + native CSS motion, ClickHouse-style structure with custom type."
dials:
  DESIGN_VARIANCE: 6
  MOTION_INTENSITY: 4
  VISUAL_DENSITY: 4

colors:
  dark:
    canvas: "#0B0C0E"
    surface-1: "#131518"
    surface-2: "#1A1D21"
    hairline: "#24272C"
    hairline-strong: "#33373D"
    ink: "#F2F3F5"
    body: "#B9BEC6"
    muted: "#8A9099"
    accent: "#FF6B1A"
    accent-text: "#FF6B1A"
    on-accent: "#0B0C0E"
    fail: "#F2555A"
    accent-hover: "color-mix(in srgb, #FF6B1A 88%, #fff)"
    accent-line: "color-mix(in srgb, #FF6B1A 38%, transparent)"
    accent-soft: "color-mix(in srgb, #FF6B1A 9%, transparent)"
  light:
    canvas: "#F4F5F6"
    surface-1: "#FCFCFD"
    surface-2: "#ECEEF0"
    hairline: "#DADDE1"
    hairline-strong: "#C5C9CF"
    ink: "#0E1013"
    body: "#3A3F47"
    muted: "#5F656E"
    accent: "#FF6B1A"
    accent-text: "#C2410C"
    on-accent: "#0B0C0E"
    fail: "#CE2C31"
    accent-hover: "color-mix(in srgb, #FF6B1A 88%, #000)"
    accent-line: "color-mix(in srgb, #C2410C 45%, transparent)"
    accent-soft: "color-mix(in srgb, #FF6B1A 12%, transparent)"

typography:
  families:
    sans: "'Archivo Variable', 'Archivo', ui-sans-serif, system-ui, sans-serif"
    mono: "'Martian Mono Variable', 'Martian Mono', ui-monospace, SFMono-Regular, Menlo, monospace"
  display-hero:   { family: sans, weight: 800, stretch: 75%, size: 120px, line: 0.88, tracking: -0.025em, use: "Case study H1 only" }
  display-xl:     { family: sans, weight: 800, stretch: 75%, size: "clamp(44px, 5.6vw, 80px)", line: 0.96, tracking: -0.02em, use: "Home H1 (ES: clamp(42px, 5.1vw, 74px))" }
  contact-xl:     { family: sans, weight: 800, stretch: 75%, size: 72px, line: 0.95, tracking: -0.02em, use: "Home contact band H2" }
  card-xl:        { family: sans, weight: 800, stretch: 75%, size: 64px, line: 0.95, tracking: -0.02em, use: "API Arena card title" }
  stat:           { family: sans, weight: 800, stretch: 75%, size: 96px, size-mobile: 64px, line: 0.9, tracking: -0.025em, color: accent-text, use: "The single \"1 month\" stat in About. There is no other stat on the site." }
  display-lg:     { family: sans, weight: 800, stretch: 75%, size: 56px, line: 1, tracking: -0.015em, use: "Section H2" }
  display-md:     { family: sans, weight: 800, stretch: 75%, size: 40px, line: 1, tracking: -0.01em, use: "Bento card H3" }
  statement:      { family: sans, weight: 800, stretch: 75%, size: 36px, line: 1.1, tracking: -0.01em, use: "Case study recognition line" }
  title-lg:       { family: sans, weight: 650, stretch: 100%, size: 26px, line: 1.2, tracking: -0.01em, use: "Bug card titles" }
  title-md:       { family: sans, weight: 650, stretch: 100%, size: 22px, line: 1.3, use: "Role titles, scenario titles" }
  title-sm:       { family: sans, weight: 650, stretch: 100%, size: 20px, line: 1.3, use: "Also-built names, ops card titles" }
  body-lg:        { family: sans, weight: 400, size: 19px, line: 1.55 }
  body:           { family: sans, weight: 400, size: 16px, line: 1.6, measure: 60ch }
  body-sm:        { family: sans, weight: 400, size: 15px, line: 1.55 }
  caption:        { family: sans, weight: 400, size: 14px, line: 1.4 }
  label:          { family: mono, weight: 400, stretch: 87.5%, size: 12px, line: 1.5, color: muted, case: lowercase }
  code:           { family: mono, weight: 400, stretch: 87.5%, size: 13px, line: 1.4, color: ink }
  tag:            { family: mono, weight: 400, stretch: 87.5%, size: 11.5px, line: 1 }
  wordmark:       { family: sans, weight: 700, stretch: 125%, size: 13px, tracking: 0.06em, case: uppercase }
  footer-mark:    { family: sans, weight: 800, stretch: 125%, size: "clamp(26px, 6.4vw, 92px)", line: 0.78, tracking: -0.01em, case: uppercase, color: hairline }
  button:         { family: sans, weight: 600, size: 15px, line: 1 }
  nav:            { family: sans, weight: 500, size: 14px }

radius: { segment: 6px, control: 8px, card: 12px, band: 16px, band-mobile: 14px, pill: 9999px, brand-square: 0 }
spacing:
  base: 4px
  container-max: 1344px
  container-pad: 32px
  container-pad-mobile: 20px
  section: 112px
  section-mobile: 72px
  hero-top: 72px
  hero-bottom: 104px
  hero-top-mobile: 48px
  hero-bottom-mobile: 48px
motion:
  ease: "cubic-bezier(.16, 1, .3, 1)"
  hover: 180ms
  border: 200ms
  image: 600ms
  hero-rise: "800ms, translateY(14px) to 0, delays 0/60/120/180/260ms"
  reveal: "600ms, translateY(16px) to 0, once, at 20% visibility"
  pulse: "7.2s loop, cubic-bezier(.65,0,.35,1)"
icons: "Phosphor regular (@phosphor-icons/core), fill currentColor, sizes 12/14/16/18/20/22/40"
---

# Design notes

## The idea in one line

A person first, then the system. The page opens on Eduardo (a short greeting, one headline, a black and white portrait) and goes straight into About, where the only number on the site lives: "1 month" from zero SAP to shipping ABAP for a bank. Only after that does the work appear, and there the site reads like a system that is running: the API Arena card carries a real pipeline with one event travelling through it. Everything technical is shown as real artifacts (service names, ports, retry timings, deploy steps), never as fake screenshots, skill bars or KPI strips.

## Voice

- English first, Spanish complete. Direct, concrete, no filler. No "passionate", no logo walls, no skill bars.
- Sentence case for every heading and button (deliberate house style, consistent across EN and ES).
- Zero em dashes and zero en dashes anywhere visible. Ranges use a spaced hyphen: `01/2026 - now`.
- At most one middle dot per line.
- One label per intent: the only contact label is "Email me" ("Escríbeme").

## Color rules

- The accent is a signal, not a theme. It appears on: the brand square, the word "run" in the H1, the primary button, the "1 month" stat and its 2 px top rule, mono highlight labels in the API Arena card, the "client work" label, the pulse and lit node, the bug card top border, the medal icon, the "runs here" dots, the Kafka pill, focus rings and selection, and once as the full contact band.
- No tinted card backgrounds. Orange over near-black turns brown. Emphasis comes from borders (`accent-line`) or text, never from fills, except the contact band.
- `accent` is for fills and graphics on dark. In light theme any accent used as text or icon uses `accent-text` (#C2410C) to keep 4.5:1.
- `fail` only appears inside diagrams, always paired with a dashed border, an x-circle icon and a text label.

## Type rules

- Archivo is one family used at three widths: 75% for display, 100% for text, 125% only for the wordmark and the giant footer mark.
- Martian Mono at 87.5% width carries facts: keys of key-value lists, service names, dates, tags. Keys are lowercase.
- Headlines use `text-wrap: balance`. Body paragraphs cap at 60ch.

## Layout rules

- Container 1280 px content, 32 px side padding, max 1344 px.
- Section rhythm 112 px desktop, 72 px mobile. Every section is a different layout family, in this order: side hero with portrait, About split (H2 and stat left, story right), flagship card with pipeline rail, two-column bug reports, asymmetric bento, timeline with aside, accent band.
- Order is a decision, not an accident: greeting, then About, then work. API Arena never appears above the fold, and no KPI or metric strip exists anywhere (no lines of code, no service counts, no usage numbers).
- Cards: `surface-1`, 1 px `hairline`, radius 12, no shadows. Hover raises the border to `hairline-strong`.
- Mobile (< 768 px): everything is one column, in source order, with the explicit sizes from the mobile artboard.

## Motion rules

- Motion explains the system: the pulse walks the pipeline; nodes light as it passes. Everything else is entry and feedback.
- Only `transform` and `opacity` animate. `prefers-reduced-motion: reduce` turns all of it off and hides the pulse.

## Do / don't

- Do show real things: real screenshots, real service names, real ports, real retry timings.
- Don't add numbers about API Arena usage. Don't name the Deloitte client. Don't say what kind of shop the Gubia client is. Don't show a phone number.
- Don't introduce a second accent, gradients, glows, shadows, emoji or custom cursors.

# Growixa Site Redesign — Design Spec

**Date:** 2026-08-31
**Status:** Approved for implementation
**Prototypes:** [Homepage](https://claude.ai/code/artifact/dfdff069-e2c4-4419-b52a-2a55f4d81e9c) · [17-page site](https://claude.ai/code/artifact/6a10d5d1-0548-4179-9fc5-9e9a61564968)

The prototypes are the visual source of truth. This document is the source of truth for
*structure, tokens, rules and content*, so the site can be rebuilt in React without drift.

---

## 1. Positioning

**Category line:** The all-in-one GTM engine for companies without a GTM team.

**Wedge.** Every competitor sells a *component* to a company that already has a go-to-market
function: Apollo assumes SDRs, Clay assumes a GTM engineer, Jasper assumes a marketing org,
Factors assumes an ABM programme, Hightouch assumes a data team. Growixa sells the *function
itself* to a founder who has a product and no team. That position is unoccupied and defensible.

**Consolidation ("replace 25 tools") is the mechanism, never the headline.** It is a price
argument that invites line-by-line comparison against incumbents — a fight a young platform
loses. It appears as proof: the sprawl section, the stack calculator, the tool marquee.

### Headline (approved)

> # Your AI `{rotating}` team.
> ## Working while you sleep.
>
> It finds your buyers, spots who's ready to talk, writes the outreach and runs the campaigns —
> replacing 25 tools and the team you haven't hired yet.

**Rotating words, in order:** `GTM` → `marketing` → `sales` → `outbound` → `growth`

The rotator is doing positioning work, not decoration. "GTM" is insider vocabulary a first-time
founder may not know; the rotation surfaces a word every visitor recognises within one cycle and
broadens the addressable reading of the product without diluting the position. The sentence must
remain true for every word in the list — that is the constraint on adding more.

### Audience

| Priority | Who | Page |
|---|---|---|
| Primary | Founders / small startups with a product and no GTM function | `/for/founders` |
| Secondary | GTM teams carrying an inherited stack (1–10 people) | `/for/gtm-teams` |
| Secondary | Marketing teams wary of AI copy risk | `/for/marketing-teams` |

---

## 2. The spine: the Growixa Engine

Five stages. Named **the Growixa Engine** — *not* "loop" (rejected: systems jargon, and
"stuck in a loop" reads badly). "Engine" also reinforces always-on better than "loop": an engine
runs, a loop merely repeats.

```
FIND ──▶ QUALIFY ──▶ CREATE ──▶ SEND ──┐
  ▲                                     │
  └──────── MANAGE (contacts) ◀─────────┘
```

**Each stage owns a hue, permanently.** This is the organising idea of the entire design: colour
carries information rather than decorating. The hue follows its stage into the mega-menu, the
page hero, section tints, product surfaces, chart series, pricing table groups, calculator
groups and roadmap dots.

| # | Stage | Hue | Status (Aug 2026) | Hands to next |
|---|---|---|---|---|
| 01 | **Find** | Cyan | Beta (invite-only) | Verified people + company facts |
| 02 | **Qualify** | Amber | Not built — Q4 2026 | A score and the reason for it |
| 03 | **Create** | Violet | Beta | Channel-ready drafts |
| 04 | **Send** | Rose | **Live** | Opens, clicks, replies |
| 05 | **Manage** | Green | **Live** | Everything, back to stage one |

The handoff column is the consolidation argument made structurally. Every arrow is a place a
stack of separate tools needs an integration, an export, or a person.

---

## 3. Design tokens

Ship as CSS custom properties on `:root`. **No component may hard-code a colour** — this rule is
what killed dark mode and broke five variables in the previous codebase.

### 3.1 Stage hues

```css
--find:#00A9E0;     --find-l:#E4F6FD;     --find-d:#00688A;
--qualify:#FF9500;  --qualify-l:#FFF2E0;  --qualify-d:#A15F00;
--create:#7B4DFF;   --create-l:#EEE9FF;   --create-d:#5B2CFF;
--send:#FF3F73;     --send-l:#FFE7EE;     --send-d:#C81E4C;
--manage:#00B884;   --manage-l:#DFF7EF;   --manage-d:#007D5A;
```

- **base** — fills, dots, rules, glows, 3px card top-borders
- **`-l` (light)** — section tints, icon plates, chips, table group rows
- **`-d` (dark)** — text on light tints. **Body text uses `-d` only**; base hues fail AA at
  body size on white. This is not optional.

### 3.2 Ground

```css
--ink:#0B0C16;      --paper:#FFFFFF;    --paper-2:#F6F6FB;  --paper-3:#EDEDF5;
--line:#E4E4EF;     --mut:#5C6076;      --faint:#656A82;
--stage:#08080F;    --stage-fg:#F2F2F8; --stage-mut:#9096B0; --stage-line:#22223A;
```

Neutrals carry a slight blue bias to sit with the hue set. `--mut` is body-secondary,
`--faint` is metadata only — never running prose.

### 3.3 Radius, shadow, layout

```css
--r-m:16px; --r-l:24px; --r-xl:34px;
--sh-1:0 1px 2px rgba(11,12,22,.06), 0 4px 12px -4px rgba(11,12,22,.08);
--sh-2:0 2px 4px rgba(11,12,22,.05), 0 18px 40px -12px rgba(11,12,22,.16);
--sh-3:0 4px 10px rgba(11,12,22,.06), 0 44px 90px -22px rgba(11,12,22,.30);
--gut:clamp(20px,3.6vw,60px);
--maxw:1560px;
```

`--sh-1` resting cards · `--sh-2` hover · `--sh-3` hero surfaces only.

### 3.4 Grain

A 140×140 SVG `feTurbulence` tile as a data URI, `opacity:.3`, `mix-blend-mode:overlay`, applied
over the hero aurora and every dark band. This is what separates a considered gradient from a
default CSS blur; do not omit it.

### 3.5 Typography

| Role | Face | Use |
|---|---|---|
| Display | **Bricolage Grotesque** 500–800 | h1–h4, stat numerals |
| Body | **Instrument Sans** 400–700 | everything readable |
| Data | **JetBrains Mono** 400–700 | eyebrows, metadata, numerals, table headers |

Self-host via `@fontsource` — no external font CDN in production.

Display sizes use `letter-spacing:-.038em` (tighter, `-.05em`, above 3rem), `line-height` .93–1.03,
`text-wrap:balance`. Body 16px / 1.6. Running prose caps at **62ch**. Uppercase mono labels get
`letter-spacing:.14em`. Any column of digits gets `font-variant-numeric:tabular-nums`.

---

## 4. Rules that prevent drift

Non-negotiable. Every one exists because breaking it produced a real defect in the old site or
would visibly fracture the system.

1. **One hue per page.** Set `--hue`, `--hue-l`, `--hue-d` on the page root; components consume
   those. A new page is one variable, not a redesign.
2. **Never hard-code a colour in a component.** Tokens only.
3. **Primary CTAs are ink (`--ink`), never a hue.** With five bright colours in play, a coloured
   primary becomes a sixth competing voice. On dark bands the primary inverts to white.
4. **Light/dark rhythm.** No two dark bands adjacent. Max one dark band per page besides the
   closing CTA. Reading happens on light; product drama happens on dark.
5. **Every feature carries a real status** — `Live` / `Beta` / `Coming Qn`. The "Live" badges are
   only believable because the unbuilt ones say so.
6. **No invented proof.** No fabricated testimonials, customer logos, headcounts or metrics.
   Illustrative figures must be labelled as such in visible copy.
7. **`-d` hue for text on light, base hue for fills.** Contrast, not taste.
8. **Motion is decoration and must be removable.** Everything works with animation off.

---

## 5. Component inventory

Build in this order; later components depend on earlier ones.

**Primitives** — `Button` (primary/glass/onstage/ghoststage × sm/md) · `Chip` (status pill,
mono, hue-tinted) · `Tag` (tiny status: live/beta/soon) · `Icon` (inline SVG, `currentColor`) ·
`Meter` (track + hue fill) · `Avatar` (gradient initials) · `Field` (label + input/select/textarea,
hue focus ring)

**Layout** — `Wrap` (max-width + gutter) · `Section` (padding, optional `--tint`) ·
`SectionHead` (two-part: title left, support right) · `CenteredHead` · `Bento` (12-col grid,
`w4/w6/w8/w12`)

**Shell** — `Header` (sticky, blur) · `MegaMenu` (hue-coded, hover on pointer + click, Escape to
close, `aria-expanded`) · `Footer` (5 columns, hue dots on engine links)

**Surfaces** — `Surface` (white card + bar) · `DarkSurface` (dark-band variant) · `Row` (icon +
text + trailing) · `DataTable` (mono headers, tabular numerals, `overflow-x` container)

**Page sections** — `PageHero` (hue gradient + glow + grain) · `Band` (dark, hue radial + grain) ·
`StageCard` · `HandoffStrip` · `Steps` (3-up) · `FeatureCard` · `PrevNext` · `CTABand` ·
`FAQ` (`<details>`) · `PostureTable` · `BeforeAfter` · `PersonaCard`

**Interactive** — `PricingToggle` (cycle + currency, both recalculate) · `StackCalculator` ·
`SandboxFind` · `SandboxCompose` · `WordRotator`

---

## 6. WordRotator

The one piece of genuinely custom behaviour. Implementation notes because it is easy to get wrong:

- Measure each word against a **hidden ghost span** that mirrors the computed font, so the width
  animation never jitters as glyph widths change.
- Sequence: add `.out` (translateY −88%, opacity 0) → after 330ms swap text, set width, add
  `.pre` (translateY +88%, no transition) → force reflow → remove `.pre` so it transitions in.
- Re-measure on `resize` and on `document.fonts.ready` — critical, or the first paint is wrong.
- Interval **2600ms**. (Tunable; 3500ms if it reads busy on second viewing.)
- Under `prefers-reduced-motion: reduce`, render `GTM` statically and never start the interval.
- Gradient-filled via `background-clip:text` — needs a solid `color` fallback.

---

## 7. Information architecture — 17 pages

```
/                        Home
/platform                The Growixa Engine — handoffs + status table
  /platform/find         01 · cyan · Beta
  /platform/qualify      02 · amber · Q4 2026
  /platform/create       03 · violet · Beta
  /platform/send         04 · rose · LIVE ← deepest page
  /platform/manage       05 · green · LIVE
/pricing                 4 tiers · stage-grouped comparison · credits · FAQ
/sandbox                 Two working demos, ungated
/stack-calculator        Interactive cost comparison
/roadmap                 4 lanes + dated changelog
/for/founders            Primary ICP — flagship solution page
/for/gtm-teams           Consolidation + "where we're not the right choice"
/for/marketing-teams     AI copy risk + guardrails
/security                Honest posture table + sub-processors
/about                   Founder's note + four commitments
/contact                 Three real addresses + form
/blog                    Honest empty state (not in main nav)
```

**Nav:** `Platform ▾` · `Solutions ▾` · `Pricing` · `Roadmap` — · `Log in` · **`Start free`**

`Platform` opens the five stages, hue-coded with live status badges, plus a link to `/platform`.
The menu teaches the product: a visitor who only hovers and leaves still learns what Growixa does
and what actually works today.

**Deliberately excluded at launch:** blog in nav, resources menu, careers, changelog page,
case studies. Empty containers signal a small company louder than having fewer pages does.

**Phase 2:** `/compare/apollo`, `/compare/clay`, `/compare/mailchimp` (high-intent SEO), `/blog`
in nav once populated, `/changelog`, `/docs`.

---

## 8. Homepage section order

Order is argued: each section answers the objection the previous one creates.

| # | Section | Surface | Job |
|---|---|---|---|
| 1 | Hero — rotator, sub, CTAs, **overnight rail** (right third) | light + aurora | State the wedge |
| 2 | Wide product composite — queue + draft + results | light | Show the whole engine at once |
| 3 | Tool marquee — two rows, opposite directions, struck through | tint | Make sprawl visceral |
| 4 | The sprawl — 25 categories + sticky cost panel | **dark** | Agitate, then price it |
| 5 | The Engine — bento 5/7/7/5 + full-width Manage | light | Explain the product |
| 6 | Qualify deep-dive — signal breakdown surface | tint | Prove one stage in depth |
| 7 | What the AI actually does — 3 checkable claims | light | Specificity over "powered by AI" |
| 8 | Closing CTA | **dark** | Convert |
| 9 | Footer | tint | Crawl + trust |

**Hero right rail** ("Last night's run") counts the overnight cycle: 3,410 sourced → 3,410 scored
→ 1,204 written → 1,204 delivered → **18 replies waiting**. It tells the whole product story in
numbers and fills the third of the viewport a centred column wastes.

---

## 9. Content & honesty rules

The previous site shipped three fabricated testimonials from people who do not exist, a
"99.8% deliverability" figure and "+340% revenue". **All of it is deleted, none of it carries
forward.** Founders are the most fraud-sensitive audience there is; one reverse-image-searched
headshot ends the deal permanently.

**Proof substitutes, in order of strength at this stage:**

1. The ungated working sandbox — proof by demonstration
2. Public roadmap with dates, including slips
3. Honest per-feature status labels
4. Signed founder's note on `/about`
5. Design partner programme — *"Fifty places. Twelve taken."* (a real invitation, not a fake count)
6. `/security` posture table stating what you **don't** have
7. Dated changelog — shipping pace as social proof

**Voice.** Plain, specific, occasionally blunt. Say what is built, not what is planned. Name
competitors where it's true and useful — including on `/for/gtm-teams`, where four rows name
Factors, Hightouch, Apollo and Outreach as better fits for specific situations. Willingness to
disqualify yourself is the strongest credibility signal available to a company with no logos.

**Illustrative figures must be labelled in visible copy**, e.g. the founders' Tuesday comparison
and the `$2,400 / 4 weeks / 1 hire` sprawl panel.

### Placeholders needing real values before launch

`hello@` / `support@` / `security@` / `privacy@growixa.com` · all pricing numbers (USD + INR) ·
AWS regions and the full sub-processor list · design-partner count · SOC 2 and pen-test dates ·
changelog entries · every contact name in product mockups (Priya Raghavan, Daniel Okoye,
Mei Tanaka, Adaeze Balogun, James Whitfield — none ship).

---

## 10. Technical architecture

Keep Vite + React 18. Additions: `react-router-dom`, `motion/react`, `@fontsource/*`,
ESLint (with `react-hooks`), Prettier, Vitest + Testing Library.

```
src/
  styles/      tokens.css  base.css  utilities.css
  components/  primitives/  layout/  shell/  surfaces/  sections/  interactive/
  pages/       Home  Platform  platform/{Find,Qualify,Create,Send,Manage}
               Pricing  Sandbox  StackCalculator  Roadmap
               for/{Founders,GtmTeams,MarketingTeams}
               Security  About  Contact  Blog
  content/     stages.js  pricing.js  tools.js  roadmap.js  faq.js
  App.jsx  main.jsx
```

**Content lives in `src/content/`, not inside components.** Stage definitions, pricing tiers,
calculator tools and roadmap items are data. This is what makes "change the price" a one-line
edit and keeps a future CMS migration cheap.

**Styling:** CSS custom properties + CSS Modules. Explicitly *not* the 5,500 lines of inline
`style={{}}` objects in the current codebase — that pattern is precisely why dark mode was dead
code and five CSS variables were silently broken.

**Delete outright** (from the pre-redesign audit): the 13 orphaned components, ~2,100 lines,
including two rival implementations of the nav and pricing (`Navbar`, `Hero`, `PricingSection`,
`ProductSuiteTabs`, `ToolkitFeatureGrid`, `EngineShowcase`, `ClarityEngineMatrix`,
`GlowingHeroOrb`, `NeuralDataStream`, `NeuronIntegrationMatrix`, `CyberneticTreeAEO`,
`AnnouncementBar`, `RoadmapMatrix`).

**Product mockups are code, not images** — SVG/CSS/DOM. They stay crisp at any density, animate,
weigh almost nothing, and update by editing a file. Real screenshots replace the Send surfaces
when supplied.

**Zero external runtime assets.** Self-hosted fonts, no CDN, no tracking pixel on first paint.

---

## 11. Motion

| Element | Motion | Duration |
|---|---|---|
| Word rotator | translateY + width | 320ms / 500ms |
| Card hover | translateY(−5px) + shadow | 220ms `cubic-bezier(.2,.8,.3,1)` |
| Button hover | translateY(−2px) | 180ms |
| Mega-menu | opacity + translateY(−6px→0) | 180ms |
| Tool marquee | translateX(0→−50%) | 46s / 54s, opposite directions |
| Live pulse dot | box-shadow ring | 2.4s |
| Section reveal | opacity + translateY(16px), once | 500ms |

`@media (prefers-reduced-motion: reduce)` disables **all** animation and transition. Scroll
reveals must render content visible by default and only animate as an enhancement — never
`opacity:0` as the base state, or reduced-motion users see a blank page.

---

## 12. Quality targets

- **Lighthouse ≥95** across all four categories, every page
- **LCP < 1.5s**, CLS < 0.05, JS bundle < 180KB gzipped
- **WCAG 2.2 AA** — 4.5:1 body contrast, visible focus on every interactive element, full
  keyboard nav including the mega-menu, correct heading order, `aria-expanded` on disclosures
- Responsive 360px → 2560px; no horizontal body scroll; wide tables scroll in their own container
- Per-page `<title>`, meta description, OG tags, canonical, JSON-LD `SoftwareApplication`
- ESLint and Vitest green in CI before merge

---

## 13. Implementation phases

| Phase | Deliverable |
|---|---|
| **0** | Foundation — router, token system, base styles, fonts; delete 13 orphaned components |
| **1** | Shell — Header, MegaMenu, Footer, layout primitives, motion setup |
| **2** | Homepage — all 9 sections including rotator and composite |
| **3** | `/platform` + five stage pages (shared template, one hue each) |
| **4** | Interactive — pricing, sandbox, stack calculator, roadmap |
| **5** | Solutions ×3, security, about, contact, blog |
| **6** | Polish — a11y audit, perf, SEO, responsive sweep, cross-browser |

Phases 0–1 are on the critical path for everything and do not depend on remaining content
decisions. Phase 2 onward can absorb copy changes without structural rework.

---

## 14. Out of scope

Backend, auth, the application itself, CMS, blog content, analytics, A/B testing infrastructure,
i18n (English only; INR pricing is a currency toggle, not a locale), and `/compare/*` SEO pages.

---

## 15. Open questions

1. **Pricing numbers** — the tiers ($0 / $29 / $89 / Custom, ₹0 / ₹2,400 / ₹7,400) are
   placeholders. Real figures needed before Phase 4.
2. **Real screenshots** — Send is shipped; supplying real UI captures would materially raise
   credibility on `/platform/send` over designed mockups.
3. **Domain and email addresses** — confirm `growixa.com` and the four addresses.
4. **Legal pages** — privacy, terms, DPA are linked but not designed. Templates or counsel?
5. **Analytics** — none specified. Recommend privacy-preserving (Plausible/Fathom) to keep the
   zero-third-party-asset property.

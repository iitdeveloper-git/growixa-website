# Carry-forward into Plan 2

Findings raised during Plan 1 (foundation & shell) that were deliberately deferred, plus
constraints Plan 2 must honour. Extracted from the SDD ledger before its workspace was deleted.

---

## 1. Must be Plan 2 Task 1 — mobile navigation

Below **900px** the header hides `.links` and `.login`, leaving only the brand mark and the
"Start free" CTA. There is currently **no route to Platform, Solutions, Pricing or Roadmap on
mobile at all.**

A mobile menu was explicitly out of Plan 1's scope, so this is not a defect — but it is the
highest-stakes deferred item on the list. For a founder-audience marketing site mobile is likely
the majority of traffic.

**Do not deploy to production between Plan 1 and Plan 2.**

---

## 2. Do early — each gets ~17× more expensive once pages exist

These were raised by the final whole-branch review as strongly recommended but non-blocking.
Every one of them is cheap now and compounds across 17 pages.

| Item | Why now |
|---|---|
| **Type & spacing scale in `tokens.css`** | Colour, radius, shadow, motion and layout are tokenised; font sizes are not. The shell already carries ~11 distinct hard-coded rem values (`0.9063`, `0.8125`, `0.875`, `0.6875`, `0.625`, `0.5938`…), several repeated across three files. Seventeen pages will each invent their own. Single highest-leverage change for reducing Plan 2 entropy. |
| **Per-route `<title>` / `<meta description>`** | Both are hard-coded in `index.html` for the home page. 17 pages sharing one title is an SEO defect. `ROUTES` already carries an unused `label` field and is the natural home. Decide the mechanism before building pages against `routes.jsx`. |
| **Path-integrity test** | Route paths live in four places (`stages.js`, `nav.js`, `Footer.jsx`'s local `PRODUCT`/`COMPANY`, inline strings in `Header.jsx`); `routes.jsx` will be the fifth. A typo yields a silent `NotFound` with no test failure. Add one test asserting every reachable path matches a `ROUTES` entry — it will be red until Plan 2 fills the table, which is the signal you want. |
| **Unify `Chip` on `hueVars`** | `Chip` injects `--c`/`--cl`/`--cd` while `Section.hueVars` injects `--hue`/`--hue-l`/`--hue-d`. The Global Constraint names only the latter. Two conventions for one concept in a five-file codebase becomes three across seventeen pages. `Chip` has zero consumers today, so unifying costs nothing. (`--c` is currently set and read by nothing.) |
| **De-duplicate `.link` / `.trigger`** | `Header.module.css` and `MegaMenu.module.css` independently declare identical padding, radius, font-size, weight, colour and hover pair. They sit adjacent in the same flex row, so drift is immediately visible. Use `composes:` or hoist. |
| **Move `hueVars` out of `Section.jsx`** | A shell component (`MegaMenu`) reaching into `components/layout/Section` for a pure string helper is a dependency that will replicate across every page. Move to `src/styles/hue.js` or `src/content/hues.js`. |

---

## 3. Bundled with the legacy deletion

Plan 2 deletes the ~12 remaining legacy components under `src/components/`
(`GrowixaHeader`, `GrowixaHero`, `GrowixaPricing`, `AISimulator`, `LeadFinderSandbox`,
`BookingModal`, `Testimonials`, `FAQAccordion`, `CompetitorComparison`, `GrowthCalculator`,
`GrowixaCapabilities`, and the top-level `Footer.jsx`). When that happens:

- **Remove `lucide-react`** — still a dependency, imported only by those files. Removing it before
  they go breaks the build.
- **The 2 known lint errors disappear** — unused `theme` / `toggleTheme` in `GrowixaHeader.jsx`,
  the dead dark-mode wiring from the original audit. Do not fix them; delete the file.
- `npm run lint` becomes clean unscoped, so the scoped-lint workaround in Plan 1's Task 10 can go.

---

## 4. Genuinely low priority

- `npm audit` reports high (vite) and critical (vitest) advisories. Both are **devDependencies**,
  confirmed absent from `dist`. Revisit at a Vite 6+ upgrade.
- `@fontsource-variable/*` resolved to `^5.3.0` where the plan said `^5.1.0`. Same major, verified
  working. No action needed, ever.
- `stages.test.js` asserts `handoff.length > 0` rather than exact text. Lowest-value of the weak
  assertions; strengthen opportunistically.
- `Button.test.jsx` matches the variant class by substring. Confirmed non-vacuous today; brittle
  only if the CSS Modules hashing config changes.
- `Section`'s `tint` + `dark` combination is undefined behaviour (resolves to `dark` by source
  order). Not reachable from any current call site; document if the API grows.
- `Button` interpolates the literal string `"undefined"` into `className` for an unrecognised
  `variant`/`size`, rendering an unstyled pill rather than failing loudly. Cheap guard available.
- Footer's four `<nav>` elements carry an `aria-label` duplicating the visible `<h2>` inside them,
  so screen readers announce each name twice. `aria-labelledby` is the idiomatic form.
- `overflow-x: hidden` on `body` silently swallows horizontal overflow. Not a bug today, but a
  broken Plan 2 layout will look "clipped" rather than obviously wrong. Consider removing once
  real pages exist.
- `routes.jsx` carries an unused `label` field. Wire it or drop it before 17 more rows appear.
- Header's "Log in" and "Start free" both point at `/pricing` as placeholders. Mark with a `TODO`
  so Plan 2 does not inherit them as intentional destinations.

---

## 5. Two lessons worth keeping

**Contrast defects hide between tasks.** Three token values shipped failing WCAG AA
(`--qualify-d`, `--manage-d`, `--faint`) and none were caught by the task that defined them or by
the tasks that consumed them — only by measuring every foreground/background pair together. Before
Plan 2 adds page-level colour combinations, run that sweep again across the full matrix.

**Weak assertions cluster in hand-written plan tests.** Five of the six test-hygiene findings were
in test code written into the plan document, not in implementer output. When a plan supplies test
code verbatim, review the assertions as carefully as the implementation — and require a deliberate
regression to prove each new test actually bites.

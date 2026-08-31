# Growixa Foundation & Shell Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current single-page site's foundation with a tested design-token system, router, and application shell (Header with hue-coded mega-menu, Footer), ready for pages to be built on top.

**Architecture:** Vite + React 18 with `react-router-dom`. All visual values live as CSS custom properties in `src/styles/tokens.css`; components consume them through CSS Modules and never hard-code colour. Product data (engine stages, nav structure) lives in `src/content/` as plain modules so it is unit-testable and editable without touching components. Vitest + Testing Library provide the test cycle.

**Tech Stack:** React 18.3, Vite 5.4, react-router-dom 6, CSS Modules, Vitest 2, @testing-library/react 16, ESLint 9 (flat config), Prettier 3, @fontsource-variable fonts.

**Spec:** `docs/superpowers/specs/2026-08-31-growixa-site-redesign-design.md`

## Global Constraints

Every task's requirements implicitly include this section. Values are copied verbatim from the spec.

- **No component may hard-code a colour.** Tokens only. This rule exists because the pre-redesign codebase had five CSS variables referenced but never defined, producing invisible modal backgrounds.
- **`-d` hue variants are the only ones legal for text on light surfaces.** Base hues fail WCAG AA at body size on white. Base hues are for fills, dots, rules and glows.
- **Primary CTAs use `--ink`, never a hue.** On dark bands they invert to white.
- **One hue per page**, set as `--hue`, `--hue-l`, `--hue-d` on the page root; components consume those.
- **Every feature reference carries a real status:** `Live` / `Beta` / `Coming Qn`.
- **No invented proof** — no fabricated testimonials, logos, headcounts or metrics. Illustrative figures must be labelled as such in visible copy.
- **`@media (prefers-reduced-motion: reduce)` disables all animation and transition.** Scroll reveals must render visible by default and animate only as enhancement — never `opacity:0` as base state.
- **Zero external runtime assets.** Self-hosted fonts, no CDN, no tracking pixel.
- **Stage hues are fixed:** Find cyan `#00A9E0`, Qualify amber `#FF9500`, Create violet `#7B4DFF`, Send rose `#FF3F73`, Manage green `#00B884`.
- **Stage statuses as of Aug 2026:** Find Beta, Qualify Coming Q4 2026, Create Beta, Send Live, Manage Live.

---

## File Structure

**Created:**

| File | Responsibility |
|---|---|
| `eslint.config.js` | Flat ESLint config with react-hooks rules |
| `.prettierrc` | Formatting config |
| `vitest.config.js` | Test runner config (jsdom, setup file) |
| `src/test/setup.js` | jest-dom matchers, `matchMedia` polyfill |
| `src/styles/tokens.css` | All design tokens as custom properties |
| `src/styles/base.css` | Reset, typography defaults, focus styles |
| `src/content/stages.js` | The five engine stages — id, name, hue, status, copy |
| `src/content/nav.js` | Nav structure derived from stages |
| `src/components/primitives/Button.jsx` + `.module.css` | Button, 4 variants × 2 sizes |
| `src/components/primitives/Chip.jsx` + `.module.css` | Status pill |
| `src/components/primitives/Tag.jsx` + `.module.css` | Tiny status badge (live/beta/soon) |
| `src/components/layout/Wrap.jsx` + `.module.css` | Max-width + gutter container |
| `src/components/layout/Section.jsx` + `.module.css` | Vertical rhythm, optional tint |
| `src/components/shell/Header.jsx` + `.module.css` | Sticky header |
| `src/components/shell/MegaMenu.jsx` + `.module.css` | Hue-coded disclosure menu |
| `src/components/shell/Footer.jsx` + `.module.css` | Five-column footer |
| `src/routes.jsx` | Route table |
| `src/pages/Home.jsx` | Placeholder, filled by Plan 2 |

**Modified:** `package.json`, `src/main.jsx`, `src/App.jsx`, `index.html`

**Deleted:** `src/index.css` and 13 orphaned components (Task 1).

---

### Task 1: Tooling and dead-code removal

Establishes the test cycle every later task depends on, and removes the ~2,100 lines of orphaned code identified in the pre-redesign audit so nothing later is built against a dead pattern.

**Files:**
- Modify: `package.json`
- Create: `eslint.config.js`, `.prettierrc`, `vitest.config.js`, `src/test/setup.js`, `src/test/smoke.test.jsx`
- Delete: 13 orphaned components

**Interfaces:**
- Consumes: nothing
- Produces: `npm test` (Vitest), `npm run lint` (ESLint), `npm run format` (Prettier). All later tasks use `npm test` as their verification command.

- [ ] **Step 1: Install dependencies**

```bash
npm install react-router-dom@^6.28.0
npm install -D vitest@^2.1.8 jsdom@^25.0.1 \
  @testing-library/react@^16.1.0 @testing-library/jest-dom@^6.6.3 \
  @testing-library/user-event@^14.5.2 \
  eslint@^9.17.0 @eslint/js@^9.17.0 globals@^15.14.0 \
  eslint-plugin-react-hooks@^5.1.0 eslint-plugin-react-refresh@^0.4.16 \
  prettier@^3.4.2
```

- [ ] **Step 2: Add scripts to `package.json`**

Replace the `"scripts"` block with:

```json
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest",
    "lint": "eslint .",
    "format": "prettier --write \"src/**/*.{js,jsx,css}\""
  },
```

- [ ] **Step 3: Create `vitest.config.js`**

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    css: true,
  },
});
```

- [ ] **Step 4: Create `src/test/setup.js`**

jsdom does not implement `matchMedia`, which every reduced-motion check calls. Without this polyfill those tests throw.

```js
import '@testing-library/jest-dom/vitest';

if (!window.matchMedia) {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  });
}
```

- [ ] **Step 5: Create `eslint.config.js`**

```js
import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default [
  { ignores: ['dist', 'coverage'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: { ...globals.browser, ...globals.node },
      parserOptions: { ecmaFeatures: { jsx: true }, sourceType: 'module' },
    },
    plugins: { 'react-hooks': reactHooks, 'react-refresh': reactRefresh },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      'react-refresh/only-export-components': 'off',
    },
  },
  {
    files: ['**/*.test.{js,jsx}', 'src/test/**'],
    languageOptions: { globals: { ...globals.vitest } },
  },
];
```

- [ ] **Step 6: Create `.prettierrc`**

```json
{
  "singleQuote": true,
  "semi": true,
  "printWidth": 100,
  "trailingComma": "es5"
}
```

- [ ] **Step 7: Write the smoke test**

Create `src/test/smoke.test.jsx`:

```jsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

function Hello() {
  return <h1>Growixa</h1>;
}

describe('test harness', () => {
  it('renders a component and finds it by role', () => {
    render(<Hello />);
    expect(screen.getByRole('heading', { name: 'Growixa' })).toBeInTheDocument();
  });
});
```

- [ ] **Step 8: Run the test to verify the harness works**

Run: `npm test`
Expected: PASS, 1 test.

- [ ] **Step 9: Delete the 13 orphaned components**

None of these are imported by `App.jsx`. Verified in the pre-redesign audit.

```bash
cd src/components && rm -f \
  AnnouncementBar.jsx ClarityEngineMatrix.jsx CyberneticTreeAEO.jsx \
  EngineShowcase.jsx GlowingHeroOrb.jsx Hero.jsx Navbar.jsx \
  NeuralDataStream.jsx NeuronIntegrationMatrix.jsx PricingSection.jsx \
  ProductSuiteTabs.jsx RoadmapMatrix.jsx ToolkitFeatureGrid.jsx
```

- [ ] **Step 10: Verify nothing broke**

Run: `npm run build`
Expected: build succeeds. If it fails with an unresolved import, a file was still referenced — restore it and investigate before continuing.

- [ ] **Step 11: Commit**

```bash
git add -A
git commit -m "chore: add test/lint tooling and remove 13 orphaned components"
```

---

### Task 2: Design tokens and base styles

**Files:**
- Create: `src/styles/tokens.css`, `src/styles/base.css`
- Modify: `src/main.jsx`
- Delete: `src/index.css`

**Interfaces:**
- Consumes: nothing
- Produces: every custom property named in the spec, available globally. All later CSS Modules read from these.

- [ ] **Step 1: Install self-hosted fonts**

```bash
npm install @fontsource-variable/bricolage-grotesque@^5.1.0 \
  @fontsource-variable/instrument-sans@^5.1.0 \
  @fontsource-variable/jetbrains-mono@^5.1.0
```

- [ ] **Step 2: Create `src/styles/tokens.css`**

```css
:root {
  /* stage hues — base for fills, -l for tints, -d for text on light */
  --find: #00a9e0;      --find-l: #e4f6fd;      --find-d: #00688a;
  --qualify: #ff9500;   --qualify-l: #fff2e0;   --qualify-d: #a15f00;
  --create: #7b4dff;    --create-l: #eee9ff;    --create-d: #5b2cff;
  --send: #ff3f73;      --send-l: #ffe7ee;      --send-d: #c81e4c;
  --manage: #00b884;    --manage-l: #dff7ef;    --manage-d: #007d5a;

  /* ground */
  --ink: #0b0c16;
  --paper: #ffffff;
  --paper-2: #f6f6fb;
  --paper-3: #ededf5;
  --line: #e4e4ef;
  --mut: #5c6076;
  --faint: #656a82;

  /* dark bands */
  --stage: #08080f;
  --stage-fg: #f2f2f8;
  --stage-mut: #9096b0;
  --stage-line: #22223a;

  /* radius */
  --r-m: 16px;
  --r-l: 24px;
  --r-xl: 34px;

  /* elevation: sh-1 resting, sh-2 hover, sh-3 hero surfaces only */
  --sh-1: 0 1px 2px rgba(11, 12, 22, 0.06), 0 4px 12px -4px rgba(11, 12, 22, 0.08);
  --sh-2: 0 2px 4px rgba(11, 12, 22, 0.05), 0 18px 40px -12px rgba(11, 12, 22, 0.16);
  --sh-3: 0 4px 10px rgba(11, 12, 22, 0.06), 0 44px 90px -22px rgba(11, 12, 22, 0.3);

  /* layout */
  --gut: clamp(20px, 3.6vw, 60px);
  --maxw: 1560px;

  /* type */
  --font-display: 'Bricolage Grotesque Variable', 'Instrument Sans', sans-serif;
  --font-body: 'Instrument Sans Variable', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'JetBrains Mono Variable', ui-monospace, monospace;

  /* motion */
  --ease-out: cubic-bezier(0.2, 0.8, 0.3, 1);
  --t-fast: 180ms;
  --t-base: 220ms;

  /* grain overlay for gradients and dark bands */
  --grain: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='.4'/%3E%3C/svg%3E");
}
```

- [ ] **Step 3: Create `src/styles/base.css`**

```css
@import '@fontsource-variable/bricolage-grotesque';
@import '@fontsource-variable/instrument-sans';
@import '@fontsource-variable/jetbrains-mono';

*,
*::before,
*::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: var(--paper);
  color: var(--ink);
  font-family: var(--font-body);
  font-size: 16px;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}

h1,
h2,
h3,
h4 {
  margin: 0;
  font-family: var(--font-display);
  font-weight: 700;
  letter-spacing: -0.038em;
  line-height: 1.03;
  text-wrap: balance;
}

a {
  color: inherit;
  text-decoration: none;
}

:focus-visible {
  outline: 2px solid var(--create);
  outline-offset: 3px;
  border-radius: 4px;
}

/* Global reduced-motion kill switch. Individual components must still render
   correctly with no animation — never rely on an animation to reveal content. */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

- [ ] **Step 4: Update `src/main.jsx`**

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles/tokens.css';
import './styles/base.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

- [ ] **Step 5: Delete the old stylesheet and the Google Fonts link**

```bash
rm src/index.css
```

In `index.html`, delete the three `<link>` tags for `fonts.googleapis.com` and `fonts.gstatic.com`. Fonts are now bundled; leaving the links makes an external request the spec forbids.

- [ ] **Step 6: Verify the build**

Run: `npm run build`
Expected: build succeeds, and the CSS output is larger than before (fonts are now inlined as `@font-face` with bundled woff2 files).

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add design token system and self-hosted fonts"
```

---

### Task 3: Engine stages content module

The five stages are referenced by the mega-menu, footer, five page heroes, the pricing table, the calculator and the roadmap. Defining them once as data is what stops the hue/status pairs drifting apart across the site.

**Files:**
- Create: `src/content/stages.js`, `src/content/stages.test.js`

**Interfaces:**
- Consumes: nothing
- Produces:
  - `STAGES` — ordered array of `{ id, num, name, hue, path, status, statusLabel, blurb, handoff }`
  - `getStage(id)` → stage object or `undefined`
  - `STATUS` — `{ LIVE: 'live', BETA: 'beta', SOON: 'soon' }`

- [ ] **Step 1: Write the failing test**

Create `src/content/stages.test.js`:

```js
import { describe, it, expect } from 'vitest';
import { STAGES, getStage, STATUS } from './stages';

describe('STAGES', () => {
  it('has exactly five stages in engine order', () => {
    expect(STAGES.map((s) => s.id)).toEqual(['find', 'qualify', 'create', 'send', 'manage']);
  });

  it('numbers stages 01 through 05', () => {
    expect(STAGES.map((s) => s.num)).toEqual(['01', '02', '03', '04', '05']);
  });

  it('assigns each stage its fixed hue', () => {
    const hues = Object.fromEntries(STAGES.map((s) => [s.id, s.hue]));
    expect(hues).toEqual({
      find: 'find',
      qualify: 'qualify',
      create: 'create',
      send: 'send',
      manage: 'manage',
    });
  });

  it('records the true build status for each stage', () => {
    expect(getStage('send').status).toBe(STATUS.LIVE);
    expect(getStage('manage').status).toBe(STATUS.LIVE);
    expect(getStage('find').status).toBe(STATUS.BETA);
    expect(getStage('create').status).toBe(STATUS.BETA);
    expect(getStage('qualify').status).toBe(STATUS.SOON);
  });

  it('gives every stage a route under /platform', () => {
    STAGES.forEach((s) => expect(s.path).toBe(`/platform/${s.id}`));
  });

  it('gives every stage a handoff description', () => {
    STAGES.forEach((s) => expect(s.handoff.length).toBeGreaterThan(0));
  });

  it('returns undefined for an unknown stage', () => {
    expect(getStage('nope')).toBeUndefined();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- stages`
Expected: FAIL — "Failed to resolve import './stages'".

- [ ] **Step 3: Write the implementation**

Create `src/content/stages.js`:

```js
export const STATUS = {
  LIVE: 'live',
  BETA: 'beta',
  SOON: 'soon',
};

export const STAGES = [
  {
    id: 'find',
    num: '01',
    name: 'Find',
    hue: 'find',
    path: '/platform/find',
    status: STATUS.BETA,
    statusLabel: 'Beta',
    blurb: 'Build a verified list from a market description.',
    handoff: 'Verified people + company facts',
  },
  {
    id: 'qualify',
    num: '02',
    name: 'Qualify',
    hue: 'qualify',
    path: '/platform/qualify',
    status: STATUS.SOON,
    statusLabel: 'Q4 2026',
    blurb: "Score who's in-market from real behaviour.",
    handoff: 'A score and the reason for it',
  },
  {
    id: 'create',
    num: '03',
    name: 'Create',
    hue: 'create',
    path: '/platform/create',
    status: STATUS.BETA,
    statusLabel: 'Beta',
    blurb: 'Writes for the channel, in your voice.',
    handoff: 'Channel-ready drafts',
  },
  {
    id: 'send',
    num: '04',
    name: 'Send',
    hue: 'send',
    path: '/platform/send',
    status: STATUS.LIVE,
    statusLabel: 'Live',
    blurb: 'Campaigns and sequences that reach the inbox.',
    handoff: 'Opens, clicks, replies',
  },
  {
    id: 'manage',
    num: '05',
    name: 'Manage',
    hue: 'manage',
    path: '/platform/manage',
    status: STATUS.LIVE,
    statusLabel: 'Live',
    blurb: 'One record per person. Everything writes to it.',
    handoff: 'Everything, back to stage one',
  },
];

export function getStage(id) {
  return STAGES.find((s) => s.id === id);
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- stages`
Expected: PASS, 7 tests.

- [ ] **Step 5: Commit**

```bash
git add src/content/stages.js src/content/stages.test.js
git commit -m "feat: add engine stages content module"
```

---

### Task 4: Button, Chip and Tag primitives

**Files:**
- Create: `src/components/primitives/Button.jsx`, `Button.module.css`, `Button.test.jsx`
- Create: `src/components/primitives/Chip.jsx`, `Chip.module.css`
- Create: `src/components/primitives/Tag.jsx`, `Tag.module.css`, `Tag.test.jsx`

**Interfaces:**
- Consumes: `STATUS` from `src/content/stages.js`
- Produces:
  - `<Button variant="primary|glass|onstage|ghoststage" size="sm|md" as={Component} {...rest} />`
  - `<Chip hue="find|qualify|create|send|manage" children />`
  - `<Tag status={STATUS.LIVE|BETA|SOON} label="Live" />`

- [ ] **Step 1: Write the failing tests**

Create `src/components/primitives/Button.test.jsx`:

```jsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import Button from './Button';

describe('Button', () => {
  it('renders as a button element by default', () => {
    render(<Button>Start free</Button>);
    expect(screen.getByRole('button', { name: 'Start free' })).toBeInTheDocument();
  });

  it('calls onClick when pressed', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Go</Button>);
    await userEvent.click(screen.getByRole('button', { name: 'Go' }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('renders as another element when given `as`', () => {
    render(
      <Button as="a" href="/pricing">
        Pricing
      </Button>
    );
    expect(screen.getByRole('link', { name: 'Pricing' })).toHaveAttribute('href', '/pricing');
  });

  it('applies the variant class', () => {
    render(<Button variant="glass">Demo</Button>);
    expect(screen.getByRole('button', { name: 'Demo' }).className).toMatch(/glass/);
  });

  it('defaults to type="button" so it never submits a form by accident', () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole('button', { name: 'Save' })).toHaveAttribute('type', 'button');
  });
});
```

Create `src/components/primitives/Tag.test.jsx`:

```jsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Tag from './Tag';
import { STATUS } from '../../content/stages';

describe('Tag', () => {
  it('renders the label', () => {
    render(<Tag status={STATUS.LIVE} label="Live" />);
    expect(screen.getByText('Live')).toBeInTheDocument();
  });

  it('applies a distinct class per status', () => {
    const { rerender } = render(<Tag status={STATUS.LIVE} label="Live" />);
    const live = screen.getByText('Live').className;
    rerender(<Tag status={STATUS.SOON} label="Q4 2026" />);
    const soon = screen.getByText('Q4 2026').className;
    expect(live).not.toBe(soon);
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test -- primitives`
Expected: FAIL — cannot resolve `./Button` and `./Tag`.

- [ ] **Step 3: Write `Button.jsx`**

```jsx
import styles from './Button.module.css';

export default function Button({
  as: Component = 'button',
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...rest
}) {
  const extra = Component === 'button' ? { type: rest.type ?? 'button' } : {};
  return (
    <Component
      className={`${styles.btn} ${styles[variant]} ${styles[size]} ${className}`}
      {...extra}
      {...rest}
    >
      {children}
    </Component>
  );
}
```

- [ ] **Step 4: Write `Button.module.css`**

```css
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: var(--font-body);
  font-weight: 600;
  border-radius: 999px;
  border: 1px solid transparent;
  cursor: pointer;
  line-height: 1.2;
  white-space: nowrap;
  transition:
    transform var(--t-fast) var(--ease-out),
    box-shadow var(--t-fast) ease,
    background var(--t-fast) ease;
}

.md {
  padding: 14px 28px;
  font-size: 0.9375rem;
}
.sm {
  padding: 9px 18px;
  font-size: 0.8438rem;
}

/* Primary is always ink, never a hue — see Global Constraints. */
.primary {
  background: var(--ink);
  color: #fff;
  box-shadow:
    0 1px 2px rgba(11, 12, 22, 0.2),
    0 12px 26px -10px rgba(11, 12, 22, 0.5);
}
.primary:hover {
  transform: translateY(-2px);
}

.glass {
  background: rgba(255, 255, 255, 0.72);
  color: var(--ink);
  border-color: rgba(11, 12, 22, 0.1);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  box-shadow: var(--sh-1);
}
.glass:hover {
  transform: translateY(-2px);
  background: #fff;
}

/* onstage / ghoststage are the dark-band inversions */
.onstage {
  background: #fff;
  color: var(--ink);
}
.onstage:hover {
  transform: translateY(-2px);
}

.ghoststage {
  background: rgba(255, 255, 255, 0.06);
  color: #fff;
  border-color: rgba(255, 255, 255, 0.22);
}
.ghoststage:hover {
  background: rgba(255, 255, 255, 0.14);
  transform: translateY(-2px);
}
```

- [ ] **Step 5: Write `Chip.jsx` and `Chip.module.css`**

`Chip.jsx`:

```jsx
import styles from './Chip.module.css';

export default function Chip({ hue = 'create', className = '', children }) {
  return (
    <span
      className={`${styles.chip} ${className}`}
      style={{ '--c': `var(--${hue})`, '--cl': `var(--${hue}-l)`, '--cd': `var(--${hue}-d)` }}
    >
      {children}
    </span>
  );
}
```

`Chip.module.css`:

```css
.chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 11px;
  border-radius: 999px;
  font-family: var(--font-mono);
  font-size: 0.625rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-weight: 600;
  background: var(--cl);
  color: var(--cd); /* -d variant: base hue fails AA at this size */
}
```

- [ ] **Step 6: Write `Tag.jsx` and `Tag.module.css`**

`Tag.jsx`:

```jsx
import styles from './Tag.module.css';

export default function Tag({ status, label }) {
  return <span className={`${styles.tag} ${styles[status]}`}>{label}</span>;
}
```

`Tag.module.css`:

```css
.tag {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-family: var(--font-mono);
  font-size: 0.5938rem;
  letter-spacing: 0.11em;
  text-transform: uppercase;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 999px;
}

.live {
  background: var(--manage-l);
  color: var(--manage-d);
}
.beta {
  background: var(--qualify-l);
  color: var(--qualify-d);
}
.soon {
  background: var(--paper-3);
  color: var(--faint);
}
```

- [ ] **Step 7: Run the tests to verify they pass**

Run: `npm test -- primitives`
Expected: PASS, 7 tests.

- [ ] **Step 8: Commit**

```bash
git add src/components/primitives
git commit -m "feat: add Button, Chip and Tag primitives"
```

---

### Task 5: Layout primitives

**Files:**
- Create: `src/components/layout/Wrap.jsx`, `Wrap.module.css`
- Create: `src/components/layout/Section.jsx`, `Section.module.css`, `Section.test.jsx`

**Interfaces:**
- Consumes: nothing
- Produces:
  - `<Wrap className children />` — max-width `--maxw` with `--gut` padding
  - `<Section tint dark hue="find" id className children />` — vertical rhythm; `tint` applies `--paper-2`, `dark` applies the dark band ground plus grain, `hue` sets `--hue/-l/-d` on the section root

- [ ] **Step 1: Write the failing test**

Create `src/components/layout/Section.test.jsx`:

```jsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Section from './Section';

describe('Section', () => {
  it('renders children inside a section landmark', () => {
    render(
      <Section id="engine">
        <h2>The Engine</h2>
      </Section>
    );
    expect(screen.getByRole('heading', { name: 'The Engine' })).toBeInTheDocument();
    expect(document.getElementById('engine')).not.toBeNull();
  });

  it('sets hue custom properties when given a hue', () => {
    const { container } = render(<Section hue="send">x</Section>);
    const el = container.firstChild;
    expect(el.style.getPropertyValue('--hue')).toBe('var(--send)');
    expect(el.style.getPropertyValue('--hue-l')).toBe('var(--send-l)');
    expect(el.style.getPropertyValue('--hue-d')).toBe('var(--send-d)');
  });

  it('does not set hue properties when no hue is given', () => {
    const { container } = render(<Section>x</Section>);
    expect(container.firstChild.style.getPropertyValue('--hue')).toBe('');
  });

  it('applies the tint modifier class', () => {
    const { container } = render(<Section tint>x</Section>);
    expect(container.firstChild.className).toMatch(/tint/);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- Section`
Expected: FAIL — cannot resolve `./Section`.

- [ ] **Step 3: Write `Wrap.jsx` and `Wrap.module.css`**

`Wrap.jsx`:

```jsx
import styles from './Wrap.module.css';

export default function Wrap({ className = '', children }) {
  return <div className={`${styles.wrap} ${className}`}>{children}</div>;
}
```

`Wrap.module.css`:

```css
.wrap {
  max-width: var(--maxw);
  margin: 0 auto;
  padding: 0 var(--gut);
  position: relative;
}
```

- [ ] **Step 4: Write `Section.jsx`**

```jsx
import styles from './Section.module.css';

export function hueVars(hue) {
  if (!hue) return undefined;
  return {
    '--hue': `var(--${hue})`,
    '--hue-l': `var(--${hue}-l)`,
    '--hue-d': `var(--${hue}-d)`,
  };
}

export default function Section({ id, tint, dark, hue, className = '', children }) {
  const cls = [styles.sec, tint && styles.tint, dark && styles.dark, className]
    .filter(Boolean)
    .join(' ');
  return (
    <section id={id} className={cls} style={hueVars(hue)}>
      {children}
    </section>
  );
}
```

- [ ] **Step 5: Write `Section.module.css`**

```css
.sec {
  padding: clamp(64px, 7vw, 112px) 0;
  position: relative;
}

.tint {
  background: var(--paper-2);
}

.dark {
  background: var(--stage);
  color: var(--stage-fg);
  overflow: hidden;
}

/* hue wash + grain: what separates a considered gradient from a plain blur */
.dark::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(760px 420px at 12% 8%, var(--hue, var(--create)), transparent 62%);
  opacity: 0.26;
}

.dark::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image: var(--grain);
  opacity: 0.3;
  mix-blend-mode: overlay;
}

.dark > * {
  position: relative;
  z-index: 2;
}
```

- [ ] **Step 6: Run the test to verify it passes**

Run: `npm test -- Section`
Expected: PASS, 4 tests.

- [ ] **Step 7: Commit**

```bash
git add src/components/layout
git commit -m "feat: add Wrap and Section layout primitives"
```

---

### Task 6: Router and app shell skeleton

**Files:**
- Create: `src/routes.jsx`, `src/pages/Home.jsx`, `src/App.test.jsx`
- Modify: `src/App.jsx`

**Interfaces:**
- Consumes: nothing
- Produces: `<App />` rendering a `BrowserRouter` with routes; `ROUTES` array exported from `src/routes.jsx` as `[{ path, element, label }]`.

- [ ] **Step 1: Write the failing test**

Create `src/App.test.jsx`:

```jsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { AppRoutes } from './App';

function renderAt(path) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AppRoutes />
    </MemoryRouter>
  );
}

describe('routing', () => {
  it('renders the home page at /', () => {
    renderAt('/');
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('renders a not-found page for an unknown path', () => {
    renderAt('/does-not-exist');
    expect(screen.getByRole('heading', { name: /not found/i })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- App`
Expected: FAIL — `AppRoutes` is not exported.

- [ ] **Step 3: Create the placeholder home page**

Create `src/pages/Home.jsx`. Plan 2 replaces the body of this file.

```jsx
import Wrap from '../components/layout/Wrap';
import Section from '../components/layout/Section';

export default function Home() {
  return (
    <Section>
      <Wrap>
        <h1>Your AI GTM team. Working while you sleep.</h1>
      </Wrap>
    </Section>
  );
}
```

- [ ] **Step 4: Create `src/routes.jsx`**

Routes for pages not yet built are added by Plans 2 and 3. Only `/` exists now.

```jsx
import Home from './pages/Home';

export const ROUTES = [{ path: '/', element: <Home />, label: 'Home' }];
```

- [ ] **Step 5: Rewrite `src/App.jsx`**

Replace the entire file. The old imports reference components deleted in Task 1.

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ROUTES } from './routes';
import Wrap from './components/layout/Wrap';
import Section from './components/layout/Section';

function NotFound() {
  return (
    <Section>
      <Wrap>
        <h1>Page not found</h1>
        <p>That page does not exist yet.</p>
      </Wrap>
    </Section>
  );
}

export function AppRoutes() {
  return (
    <Routes>
      {ROUTES.map((r) => (
        <Route key={r.path} path={r.path} element={r.element} />
      ))}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
```

- [ ] **Step 6: Run the tests to verify they pass**

Run: `npm test -- App`
Expected: PASS, 2 tests.

- [ ] **Step 7: Verify the dev server renders**

Run: `npm run dev`, open `http://localhost:3000`
Expected: the headline renders in Bricolage Grotesque on white. Navigate to `/nope` and confirm "Page not found".

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: add router and app shell skeleton"
```

---

### Task 7: MegaMenu

The most behaviour-heavy component in the shell, and the one where accessibility is easiest to get wrong. It must open on hover for pointer users, on click for everyone, close on Escape and on outside click, and report state via `aria-expanded`.

**Files:**
- Create: `src/components/shell/MegaMenu.jsx`, `MegaMenu.module.css`, `MegaMenu.test.jsx`

**Interfaces:**
- Consumes: `STAGES` from `src/content/stages.js`, `Tag` from `src/components/primitives/Tag`
- Produces: `<MegaMenu label="Platform" items={[{ id, name, blurb, hue, path, status, statusLabel }]} footer={ReactNode} />`

- [ ] **Step 1: Write the failing test**

Create `src/components/shell/MegaMenu.test.jsx`:

```jsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import MegaMenu from './MegaMenu';
import { STAGES } from '../../content/stages';

function setup() {
  return render(
    <MemoryRouter>
      <MegaMenu label="Platform" items={STAGES} />
      <button type="button">outside</button>
    </MemoryRouter>
  );
}

describe('MegaMenu', () => {
  it('is collapsed initially', () => {
    setup();
    expect(screen.getByRole('button', { name: /platform/i })).toHaveAttribute(
      'aria-expanded',
      'false'
    );
  });

  it('opens on click and reports expanded state', async () => {
    setup();
    await userEvent.click(screen.getByRole('button', { name: /platform/i }));
    expect(screen.getByRole('button', { name: /platform/i })).toHaveAttribute(
      'aria-expanded',
      'true'
    );
    expect(screen.getByRole('link', { name: /find/i })).toBeVisible();
  });

  it('shows every stage with its status label', async () => {
    setup();
    await userEvent.click(screen.getByRole('button', { name: /platform/i }));
    expect(screen.getByText('Live')).toBeInTheDocument();
    expect(screen.getByText('Q4 2026')).toBeInTheDocument();
    expect(screen.getAllByText('Beta')).toHaveLength(2);
  });

  it('closes on Escape', async () => {
    setup();
    await userEvent.click(screen.getByRole('button', { name: /platform/i }));
    await userEvent.keyboard('{Escape}');
    expect(screen.getByRole('button', { name: /platform/i })).toHaveAttribute(
      'aria-expanded',
      'false'
    );
  });

  it('closes when clicking outside', async () => {
    setup();
    await userEvent.click(screen.getByRole('button', { name: /platform/i }));
    await userEvent.click(screen.getByRole('button', { name: 'outside' }));
    expect(screen.getByRole('button', { name: /platform/i })).toHaveAttribute(
      'aria-expanded',
      'false'
    );
  });

  it('links each stage to its route', async () => {
    setup();
    await userEvent.click(screen.getByRole('button', { name: /platform/i }));
    expect(screen.getByRole('link', { name: /find/i })).toHaveAttribute(
      'href',
      '/platform/find'
    );
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- MegaMenu`
Expected: FAIL — cannot resolve `./MegaMenu`.

- [ ] **Step 3: Write `MegaMenu.jsx`**

```jsx
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Tag from '../primitives/Tag';
import { hueVars } from '../layout/Section';
import styles from './MegaMenu.module.css';

export default function MegaMenu({ label, items, footer }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, [open]);

  // Hover only where a real pointer exists; touch devices use click.
  const hoverable =
    typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches;

  return (
    <div
      className={`${styles.item} ${open ? styles.open : ''}`}
      ref={ref}
      onMouseEnter={hoverable ? () => setOpen(true) : undefined}
      onMouseLeave={hoverable ? () => setOpen(false) : undefined}
    >
      <button
        type="button"
        className={styles.trigger}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {label}
        <svg className={styles.caret} width="12" height="12" viewBox="0 0 14 14" aria-hidden="true">
          <path
            d="M3.5 5.5L7 9l3.5-3.5"
            stroke="currentColor"
            strokeWidth="1.6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div className={styles.panel} hidden={!open}>
        <div className={styles.grid}>
          {items.map((it) => (
            <Link
              key={it.id}
              to={it.path}
              className={styles.entry}
              style={hueVars(it.hue)}
              onClick={() => setOpen(false)}
            >
              <span className={styles.plate} aria-hidden="true" />
              <span className={styles.text}>
                <span className={styles.name}>
                  {it.name}
                  {it.statusLabel ? <Tag status={it.status} label={it.statusLabel} /> : null}
                </span>
                <span className={styles.blurb}>{it.blurb}</span>
              </span>
            </Link>
          ))}
        </div>
        {footer ? <div className={styles.footer}>{footer}</div> : null}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Write `MegaMenu.module.css`**

```css
.item {
  position: relative;
}

.trigger {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 9px 15px;
  border-radius: 999px;
  font-family: var(--font-body);
  font-size: 0.9063rem;
  font-weight: 500;
  color: var(--mut);
  background: none;
  border: none;
  cursor: pointer;
  transition:
    background var(--t-fast) ease,
    color var(--t-fast) ease;
}

.trigger:hover,
.open .trigger {
  background: var(--paper-2);
  color: var(--ink);
}

.caret {
  transition: transform var(--t-base) ease;
}
.open .caret {
  transform: rotate(180deg);
}

.panel {
  position: absolute;
  top: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%);
  width: 760px;
  max-width: 92vw;
  background: var(--paper);
  border: 1px solid var(--line);
  border-radius: var(--r-l);
  box-shadow: var(--sh-3);
  padding: 12px;
  z-index: 300;
}

.panel[hidden] {
  display: none;
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px;
}

.entry {
  display: flex;
  gap: 13px;
  padding: 13px;
  border-radius: 14px;
  align-items: flex-start;
  transition: background var(--t-fast) ease;
}
.entry:hover {
  background: var(--hue-l);
}

.plate {
  width: 36px;
  height: 36px;
  border-radius: 11px;
  flex: none;
  background: var(--hue-l);
  border: 1px solid var(--hue);
}

.text {
  display: block;
}

.name {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9063rem;
  font-weight: 650;
  letter-spacing: -0.015em;
  color: var(--ink);
}

.blurb {
  display: block;
  font-size: 0.8125rem;
  color: var(--mut);
  line-height: 1.45;
  margin-top: 2px;
}

.footer {
  margin-top: 8px;
  border-top: 1px solid var(--line);
  padding: 14px 13px 6px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

@media (max-width: 900px) {
  .panel {
    position: static;
    transform: none;
    width: 100%;
    box-shadow: none;
    border: none;
    padding: 0;
  }
  .grid {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 5: Run the tests to verify they pass**

Run: `npm test -- MegaMenu`
Expected: PASS, 6 tests.

- [ ] **Step 6: Commit**

```bash
git add src/components/shell
git commit -m "feat: add accessible hue-coded MegaMenu"
```

---

### Task 8: Header

**Files:**
- Create: `src/components/shell/Header.jsx`, `Header.module.css`, `Header.test.jsx`
- Create: `src/content/nav.js`
- Modify: `src/App.jsx`

**Interfaces:**
- Consumes: `MegaMenu`, `Button`, `STAGES`
- Produces: `<Header />`; `SOLUTIONS` array exported from `src/content/nav.js` as `[{ id, name, blurb, hue, path }]`

- [ ] **Step 1: Write the failing test**

Create `src/components/shell/Header.test.jsx`:

```jsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Header from './Header';

function setup() {
  return render(
    <MemoryRouter>
      <Header />
    </MemoryRouter>
  );
}

describe('Header', () => {
  it('renders a banner landmark', () => {
    setup();
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('links the brand to home', () => {
    setup();
    expect(screen.getByRole('link', { name: /growixa/i })).toHaveAttribute('href', '/');
  });

  it('renders both disclosure menus collapsed', () => {
    setup();
    expect(screen.getByRole('button', { name: /platform/i })).toHaveAttribute(
      'aria-expanded',
      'false'
    );
    expect(screen.getByRole('button', { name: /solutions/i })).toHaveAttribute(
      'aria-expanded',
      'false'
    );
  });

  it('renders the direct nav links', () => {
    setup();
    expect(screen.getByRole('link', { name: 'Pricing' })).toHaveAttribute('href', '/pricing');
    expect(screen.getByRole('link', { name: 'Roadmap' })).toHaveAttribute('href', '/roadmap');
  });

  it('renders the primary call to action', () => {
    setup();
    expect(screen.getByRole('link', { name: /start free/i })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- Header`
Expected: FAIL — cannot resolve `./Header`.

- [ ] **Step 3: Create `src/content/nav.js`**

```js
export const SOLUTIONS = [
  {
    id: 'founders',
    name: 'Founders',
    blurb: 'You are the GTM team. For now.',
    hue: 'send',
    path: '/for/founders',
  },
  {
    id: 'gtm-teams',
    name: 'GTM teams',
    blurb: 'Replace the stack you inherited.',
    hue: 'find',
    path: '/for/gtm-teams',
  },
  {
    id: 'marketing-teams',
    name: 'Marketing teams',
    blurb: 'Campaigns without the tool tax.',
    hue: 'create',
    path: '/for/marketing-teams',
  },
];
```

- [ ] **Step 4: Write `Header.jsx`**

```jsx
import { Link } from 'react-router-dom';
import MegaMenu from './MegaMenu';
import Button from '../primitives/Button';
import Wrap from '../layout/Wrap';
import { STAGES } from '../../content/stages';
import { SOLUTIONS } from '../../content/nav';
import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.hdr}>
      <Wrap>
        <nav className={styles.nav} aria-label="Main">
          <Link to="/" className={styles.brand}>
            <span className={styles.mark} aria-hidden="true">
              <svg width="14" height="14" viewBox="0 0 14 14">
                <path d="M7.6 1 2.6 8h3.1l-.5 5 5-7H7.1z" fill="var(--ink)" />
              </svg>
            </span>
            Growixa
          </Link>

          <div className={styles.links}>
            <MegaMenu
              label="Platform"
              items={STAGES}
              footer={
                <>
                  <span className={styles.note}>
                    Email campaigns are live today — the rest ships through 2026
                  </span>
                  <Button as={Link} to="/roadmap" size="sm">
                    See the roadmap
                  </Button>
                </>
              }
            />
            <MegaMenu label="Solutions" items={SOLUTIONS} />
            <Link to="/pricing" className={styles.link}>
              Pricing
            </Link>
            <Link to="/roadmap" className={styles.link}>
              Roadmap
            </Link>
          </div>

          <div className={styles.cta}>
            <Link to="/pricing" className={styles.login}>
              Log in
            </Link>
            <Button as={Link} to="/pricing" size="sm">
              Start free
            </Button>
          </div>
        </nav>
      </Wrap>
    </header>
  );
}
```

- [ ] **Step 5: Write `Header.module.css`**

```css
.hdr {
  position: sticky;
  top: 0;
  z-index: 200;
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(20px) saturate(1.5);
  -webkit-backdrop-filter: blur(20px) saturate(1.5);
  border-bottom: 1px solid var(--line);
}

.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 14px 0;
}

.brand {
  display: flex;
  align-items: center;
  gap: 11px;
  font-weight: 700;
  font-size: 1.3125rem;
  letter-spacing: -0.035em;
}

/* The conic gradient is the one place all five hues appear at once — the mark
   is the engine. */
.mark {
  width: 34px;
  height: 34px;
  border-radius: 11px;
  flex: none;
  display: grid;
  place-items: center;
  background: conic-gradient(
    from 210deg,
    var(--find),
    var(--create),
    var(--send),
    var(--qualify),
    var(--manage),
    var(--find)
  );
  box-shadow: 0 5px 16px -5px rgba(123, 77, 255, 0.55);
}

.mark svg {
  background: #fff;
  border-radius: 8px;
  padding: 5px;
  width: 24px;
  height: 24px;
}

.links {
  display: flex;
  align-items: center;
  gap: 2px;
}

.link {
  padding: 9px 15px;
  border-radius: 999px;
  font-size: 0.9063rem;
  font-weight: 500;
  color: var(--mut);
  transition:
    background var(--t-fast) ease,
    color var(--t-fast) ease;
}
.link:hover {
  background: var(--paper-2);
  color: var(--ink);
}

.cta {
  display: flex;
  align-items: center;
  gap: 10px;
}

.login {
  font-size: 0.9063rem;
  font-weight: 500;
  color: var(--mut);
  padding: 8px 6px;
}

.note {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--faint);
}

@media (max-width: 900px) {
  .links {
    display: none;
  }
  .login {
    display: none;
  }
}
```

- [ ] **Step 6: Mount the Header in `App.jsx`**

Replace the `App` function (leave `AppRoutes` and `NotFound` as they are) and add the import:

```jsx
import Header from './components/shell/Header';
```

```jsx
export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <main>
        <AppRoutes />
      </main>
    </BrowserRouter>
  );
}
```

- [ ] **Step 7: Run the full suite**

Run: `npm test`
Expected: PASS, all tests.

- [ ] **Step 8: Verify in the browser**

Run: `npm run dev`
Expected: sticky header with a conic-gradient mark. Hover Platform — five stages appear, each with a status tag; Send and Manage read "Live", Qualify reads "Q4 2026". Press Escape to close. Tab to the trigger and press Enter — it opens.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: add sticky Header with Platform and Solutions menus"
```

---

### Task 9: Footer

**Files:**
- Create: `src/components/shell/Footer.jsx`, `Footer.module.css`, `Footer.test.jsx`
- Modify: `src/App.jsx`

**Interfaces:**
- Consumes: `STAGES`, `SOLUTIONS`, `Wrap`
- Produces: `<Footer />`

- [ ] **Step 1: Write the failing test**

Create `src/components/shell/Footer.test.jsx`:

```jsx
import { render, screen, within } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Footer from './Footer';

function setup() {
  return render(
    <MemoryRouter>
      <Footer />
    </MemoryRouter>
  );
}

describe('Footer', () => {
  it('renders a contentinfo landmark', () => {
    setup();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('links all five engine stages', () => {
    setup();
    const group = screen.getByRole('navigation', { name: /the engine/i });
    ['Find', 'Qualify', 'Create', 'Send', 'Manage'].forEach((name) => {
      expect(within(group).getByRole('link', { name })).toBeInTheDocument();
    });
  });

  it('states the honest build status in the base row', () => {
    setup();
    expect(screen.getByText(/qualify ships q4/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- Footer`
Expected: FAIL — cannot resolve `./Footer`.

- [ ] **Step 3: Write `Footer.jsx`**

```jsx
import { Link } from 'react-router-dom';
import Wrap from '../layout/Wrap';
import { STAGES } from '../../content/stages';
import { SOLUTIONS } from '../../content/nav';
import styles from './Footer.module.css';

const PRODUCT = [
  { to: '/pricing', label: 'Pricing' },
  { to: '/sandbox', label: 'Try the sandbox' },
  { to: '/stack-calculator', label: 'Stack calculator' },
  { to: '/roadmap', label: 'Roadmap' },
];

const COMPANY = [
  { to: '/about', label: 'About' },
  { to: '/security', label: 'Security' },
  { to: '/contact', label: 'Contact' },
];

export default function Footer() {
  return (
    <footer className={styles.ftr}>
      <Wrap>
        <div className={styles.grid}>
          <div>
            <Link to="/" className={styles.brand}>
              Growixa
            </Link>
            <p className={styles.blurb}>
              The go-to-market engine for companies that don&rsquo;t have a go-to-market team yet.
            </p>
          </div>

          <nav className={styles.col} aria-label="The Engine">
            <h2 className={styles.h}>The Engine</h2>
            <ul>
              {STAGES.map((s) => (
                <li key={s.id}>
                  <Link to={s.path}>
                    <i style={{ background: `var(--${s.hue})` }} aria-hidden="true" />
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav className={styles.col} aria-label="Product">
            <h2 className={styles.h}>Product</h2>
            <ul>
              {PRODUCT.map((l) => (
                <li key={l.to}>
                  <Link to={l.to}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav className={styles.col} aria-label="Solutions">
            <h2 className={styles.h}>Solutions</h2>
            <ul>
              {SOLUTIONS.map((s) => (
                <li key={s.id}>
                  <Link to={s.path}>For {s.name.toLowerCase()}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav className={styles.col} aria-label="Company">
            <h2 className={styles.h}>Company</h2>
            <ul>
              {COMPANY.map((l) => (
                <li key={l.to}>
                  <Link to={l.to}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className={styles.base}>
          <span>&copy; 2026 Growixa. Built by a small team in public.</span>
          <span>
            Campaigns and contacts are live. Find and Create are in beta. Qualify ships Q4.
          </span>
        </div>
      </Wrap>
    </footer>
  );
}
```

- [ ] **Step 4: Write `Footer.module.css`**

```css
.ftr {
  background: var(--paper-2);
  border-top: 1px solid var(--line);
  padding: 72px 0 40px;
}

.grid {
  display: grid;
  grid-template-columns: 1.5fr repeat(4, 1fr);
  gap: 48px;
  margin-bottom: 52px;
}

.brand {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.035em;
}

.blurb {
  color: var(--mut);
  font-size: 0.9063rem;
  margin: 16px 0 0;
  max-width: 34ch;
  line-height: 1.55;
}

.h {
  font-family: var(--font-body);
  font-size: 0.8125rem;
  font-weight: 700;
  margin: 0 0 16px;
  letter-spacing: 0.02em;
}

.col ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 11px;
}

.col a {
  color: var(--mut);
  font-size: 0.875rem;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: color var(--t-fast) ease;
}
.col a:hover {
  color: var(--ink);
}

.col a i {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex: none;
}

.base {
  border-top: 1px solid var(--line);
  padding-top: 26px;
  display: flex;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
  color: var(--faint);
  font-size: 0.8125rem;
}

@media (max-width: 1200px) {
  .grid {
    grid-template-columns: 1fr 1fr 1fr;
    gap: 36px;
  }
}

@media (max-width: 620px) {
  .grid {
    grid-template-columns: 1fr 1fr;
  }
}
```

- [ ] **Step 5: Mount the Footer in `App.jsx`**

Add the import and place `<Footer />` after `</main>`:

```jsx
import Footer from './components/shell/Footer';
```

```jsx
export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <main>
        <AppRoutes />
      </main>
      <Footer />
    </BrowserRouter>
  );
}
```

- [ ] **Step 6: Run the tests to verify they pass**

Run: `npm test -- Footer`
Expected: PASS, 3 tests.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add Footer with engine, product, solutions and company columns"
```

---

### Task 10: Verify the shell

No new features. This task proves the foundation is sound before Plan 2 builds on it.

**Files:**
- Modify: `index.html` (metadata)

**Interfaces:**
- Consumes: everything above
- Produces: a green suite, a clean lint, and a passing build.

- [ ] **Step 1: Update `index.html` metadata**

Replace the `<title>` and description; the current ones describe the old positioning.

```html
<title>Growixa — Your AI GTM team, working while you sleep</title>
<meta
  name="description"
  content="Growixa finds your buyers, spots who's ready to talk, writes the outreach and runs the campaigns — one platform instead of 25 tools and a go-to-market team you haven't hired yet."
/>
```

- [ ] **Step 2: Run the full test suite**

Run: `npm test`
Expected: PASS. Roughly 27 tests across 7 files.

- [ ] **Step 3: Run the linter**

Run: `npm run lint`
Expected: no errors. Fix any unused imports it reports — the previous codebase had about 60, and the point of adding ESLint was to stop that recurring.

- [ ] **Step 4: Run the formatter**

Run: `npm run format`
Expected: files rewritten consistently. Re-run `npm test` afterwards to confirm formatting broke nothing.

- [ ] **Step 5: Build and check bundle size**

Run: `npm run build`
Expected: build succeeds. Note the gzipped JS figure — the budget is **under 180KB gzipped** for the finished site, and the shell alone should be well under 100KB.

- [ ] **Step 6: Manual keyboard pass**

Run `npm run dev`, then with the keyboard only:
- Tab from the top. Every interactive element must show a visible focus ring.
- Tab to "Platform", press Enter — the panel opens. Press Escape — it closes and focus stays on the trigger.
- Tab through the footer. All links reachable, no traps.

- [ ] **Step 7: Reduced-motion check**

In your OS accessibility settings enable "reduce motion", reload, and confirm the header, menu and buttons all still work with no transitions.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "chore: update page metadata and verify shell"
```

---

## Self-Review

**Spec coverage.** §3 tokens → Task 2. §2 stages and hue ownership → Task 3. §5 primitives (Button, Chip, Tag) → Task 4; (Wrap, Section) → Task 5. §5 shell (Header, MegaMenu, Footer) → Tasks 7–9. §10 architecture, tooling and dead-code removal → Task 1. §12 quality targets → Task 10. §7 routing → Task 6.

**Deferred to later plans, by design:** §6 WordRotator, §8 homepage sections, §9 content rules applied to page copy, remaining components (`SectionHead`, `Bento`, `Surface`, `DarkSurface`, `Row`, `DataTable`, `PageHero`, `Band`, `StageCard`, `HandoffStrip`, `Steps`, `FeatureCard`, `PrevNext`, `CTABand`, `FAQ`, `PostureTable`, `BeforeAfter`, `PersonaCard`), all interactive components, and §11 motion beyond the base transitions.

**Placeholder scan.** No TBDs. Every code step carries the actual content. `src/pages/Home.jsx` is a deliberate placeholder, marked as such, replaced by Plan 2.

**Type consistency.** `hueVars(hue)` is defined in Task 5 (`Section.jsx`) and consumed in Task 7 (`MegaMenu.jsx`) under the same name and signature. `STAGES`/`getStage`/`STATUS` defined Task 3, consumed Tasks 4, 7, 8, 9. `SOLUTIONS` defined Task 8, consumed Task 9. `AppRoutes` exported Task 6, consumed by `src/App.test.jsx` in the same task. `Tag` takes `{ status, label }` in Task 4 and is called with exactly those in Task 7.

---

## Next plans

- **Plan 2 — Homepage:** WordRotator, hero with overnight rail, product composite, tool marquee, sprawl section, engine bento, Qualify deep-dive, AI section, closing CTA.
- **Plan 3 — Remaining pages:** `/platform` + five stage pages, pricing, sandbox, stack calculator, roadmap, three solutions pages, security, about, contact, blog, then the a11y/perf/SEO sweep.

# iDF Hub — AI Agent Rules

> Universal rules for all AI assistants (Claude, Copilot, Cursor, WindSurf, Aider, etc.)
> This is the canonical source. Other rule files reference this one.

---

## 1. Language

- All code, comments, JSDoc, variable names, commit messages, and documentation must be written in **English**.
- User-facing UI strings may be in Italian only when explicitly confirmed by the owner.

---

## 2. Mobile-First & Hardware

- **Design for mobile first**, then progressively enhance for desktop.
- Every interactive element must have a minimum touch target of **44×44px**.
- Exploit device hardware wherever it adds genuine UX value:
  - **Gyroscope / DeviceMotion** → tilt/parallax effects on supported devices
  - **Vibration API** → subtle haptic feedback on key actions (game events, confirmations)
  - **Touch events** → swipe gestures, pinch-zoom, long-press where natural
  - **WebGL / Three.js** → GPU-accelerated visuals already in stack — use them
  - **`matchMedia` / `IntersectionObserver`** → lazy enhancement, never force hardware features
- Always provide a graceful degradation path when a hardware API is unavailable.
- Test on real mobile viewports (375px, 390px, 430px) not just browser resize.

---

## 3. Accessibility (WCAG AA)

- Semantic HTML always: use `<button>`, `<nav>`, `<main>`, `<section>`, `<article>` correctly.
- Every interactive element must be keyboard-reachable and have a visible `:focus-visible` style.
- All images need meaningful `alt` text; decorative images use `alt=""`.
- Color contrast ratio ≥ 4.5:1 for text, ≥ 3:1 for large text and UI components.
- Respect `prefers-reduced-motion`: wrap all non-essential animations in:
  ```scss
  @media (prefers-reduced-motion: no-preference) { ... }
  ```
- Use `aria-label`, `aria-describedby`, `role` only when native semantics are insufficient.
- Never remove `:focus` outlines without a visible replacement.

---

## 4. Design System — Strict Compliance

### Design Rules from ai_rules/ (authoritative)

#### Icons (`ai_rules/Icons guidelines.pdf`)
- Base size: **24px**
- Stroke weight: **2px**
- Stroke caps: **rounded**
- Use Lucide React icons (already in stack)

#### Typography (`ai_rules/Typefaces.pdf`, `Typefaces Details.pdf`)
- Primary font: **Josefin Sans** (display/headings)
- Mono font: **Geist Mono** (code/terminal)
- Type scale: **12 / 14 / 16 / 18 / 24 / 32 / 48 / 72px**
- Use `$font-size-*` tokens only

#### Spacing (`ai_rules/Spacings.pdf`, `Units.pdf`)
- Base unit: **4px**
- Scale: **4, 8, 16, 24, 32, 48, 80, 120, 160px**
- Use `$spacing-*` tokens only — never hardcode pixels

### Tokens (defined in `src/styles/_variables.scss`)

| Token | Use |
|---|---|
| `$color-volta-light / dark` | Primary accent (violet `#8b5cf6` / `#a78bfa`) |
| `$color-lario-light / dark` | Secondary accent (blue `#3b82f6` / `#60a5fa`) |
| `$color-silk-light / dark` | Background (`#fafafa` / `#0a0a0a`) |
| `$color-slate-light / dark` | Text (`#111827` / `#f3f4f6`) |
| `$color-slate-muted` | Muted/secondary text (`#64748b`) |
| `$color-category-*` | Category badge colors only |
| `$spacing-*` | All spacing values (xs/sm/md/lg/xl/xxl) |
| `$font-family-primary` | Josefin Sans |
| `$font-family-mono` | Geist Mono |
| `$font-size-*` | All type sizes |
| `$breakpoint-*` | Media query breakpoints |

### Rules

- **Never** hardcode hex colors, pixel values for spacing, or font sizes. Always use a design token.
- **Never** use inline `style={{}}` for visual styling — CSS Modules only.
- CSS variables (`var(--color-bg)` etc.) are the runtime theme layer; SCSS variables are compile-time tokens. Use both correctly.
- Adding new tokens to `_variables.scss` requires a comment explaining the purpose.

---

## 5. Atomic Component Architecture

Components live in `src/components/` and follow strict Atomic Design:

```
atoms/       ← smallest units: Button, Icon, Badge, Tag, Input
molecules/   ← composed atoms: Card, FormField, NavItem, Modal
organisms/   ← complex UI blocks: Terminal, Header, ProjectGrid, BrandPage
templates/   ← page layout wrappers: Layout
```

### Rules

- A component belongs in the **lowest level** that fully describes it.
- Each component gets its own folder: `ComponentName/index.tsx` + `ComponentName.module.scss` + optional `ComponentName.test.tsx`.
- **Maximum ~200 lines** per component file. Extract sub-components or hooks if exceeded.
- No component imports from a higher atomic level (atoms must not import molecules).
- Business logic goes in custom hooks (`src/hooks/`), not inside components.
- Shared types go in `src/types/`; never define a type inline in a component if it's reused.

---

## 6. File & Code Quality

- **No file should exceed 300 lines** without a clear architectural reason (and a comment explaining it).
- Every exported function and component must have a **JSDoc comment**:
  ```ts
  /**
   * Renders a tilt-enabled project card with GPU-accelerated hover effects.
   * @param project - Normalised project object from Supabase
   * @param priority - Whether to eager-load the thumbnail image
   */
  ```
- One component per file. No barrel exports that mask module boundaries.
- No `console.log` left in production code — use `console.warn` / `console.error` for real errors only.
- No `TODO` comments committed without a linked GitHub issue number.
- No dead code — remove unused imports, variables, and functions before committing.

---

## 7. TypeScript

- Strict mode is enabled — no `any`. Use `unknown` + type guard if the shape is truly unknown.
- All component props must be typed with an `interface`, not `type` alias (for better IDE hover).
- Prefer `const` assertions and `as const` for static config objects.
- Avoid type assertions (`as SomeType`) unless absolutely necessary, document why.
- `null` vs `undefined`: prefer `undefined` for optional values; use `null` only for explicit "empty" database/API values.

---

## 8. Styling with SCSS Modules

- One `.module.scss` file per component — no global class overrides.
- Use `@use '../../../styles/variables' as *` to import tokens (never `@import`).
- BEM-light naming: `.card`, `.card__title`, `.card--featured` (no deep nesting > 3 levels).
- Animations must be defined as `@keyframes` in the module, not inline JS styles.
- Responsive styles use the `$breakpoint-*` variables:
  ```scss
  @media (max-width: $breakpoint-md) { ... }
  ```

---

## 9. Performance

- **Images**: always use `next/image` with explicit `width`/`height` or `fill` + `sizes`. Never `<img>`.
- **Code splitting**: dynamic import (`next/dynamic`) for heavy components (Three.js scenes, Terminal, heavy modals).
- **Fonts**: loaded via `next/font` — already configured in `layout.tsx`. Never add `@import` for fonts.
- **Bundle**: no new heavy dependencies without checking bundle impact first (`npm run build` and check output sizes).
- **Animation**: prefer CSS transforms (`translate`, `scale`, `rotate`) over layout-affecting properties. GSAP for timeline sequences, Framer Motion for React state-driven transitions.

---

## 10. Animations & Interactions

- Every animation must feel **intentional** — it should communicate state change, not just decorate.
- Duration guidelines: micro-interactions 80–150ms, transitions 200–350ms, reveals 400–600ms.
- Use `will-change: transform` sparingly and only when GPU promotion is confirmed beneficial.
- Hardware-accelerated effects (tilt, parallax, 3D): check `window.DeviceMotionEvent` / `matchMedia('(hover: hover)')` before activating.
- The "wow" factor comes from **timing + physics** (spring curves, momentum), not from over-complexity.

---

## 11. Supabase & Backend

- **Row Level Security (RLS) is always enabled** on every table.
- Never use the `service_role` key in client-side code — it belongs only in server actions / API routes.
- Public reads: allowed via RLS policy `FOR SELECT USING (true)`.
- Writes: only authenticated users (`TO authenticated`).
- All schema changes must be reflected in `docs/schema.sql` with `DROP POLICY IF EXISTS` guards for idempotency.
- Environment variables: `NEXT_PUBLIC_*` for browser-safe values, no prefix for server-only secrets.

---

## 12. Git & Commits

- Conventional Commits format: `feat:`, `fix:`, `style:`, `refactor:`, `docs:`, `chore:`, `test:`.
- Commits must be atomic — one logical change per commit.
- Never commit: `.env*` files, `node_modules/`, `.next/`, or any file with secrets.
- Every Copilot-assisted commit includes the trailer:
  ```
  Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>
  ```

---

## 13. Testing

- Run `npm test` — Jest with `next/jest`. Config in `jest.config.ts`.
- Test files: co-located with component at `ComponentName/ComponentName.test.tsx`.
- Test behavior, not implementation: prefer `getByRole`, `getByLabelText`, avoid `getByTestId`.
- No snapshot tests — they break too easily and add no semantic value.
- All custom hooks must have unit tests.

---

## 14. Project Stack Reference

| Tool | Purpose |
|---|---|
| Next.js 16 + Turbopack | Framework |
| Supabase | Auth + Postgres DB |
| SCSS Modules | Styling |
| Framer Motion | React-state animations |
| GSAP | Timeline / scroll animations |
| Three.js + R3F | 3D / WebGL scenes |
| Lucide React | Icons |
| Vercel | Hosting + Analytics |
| Jest | Testing |

---

## Quick Checklist Before Every Commit

- [ ] No hardcoded colors or spacing values
- [ ] All new components have JSDoc
- [ ] Mobile viewport tested (375px)
- [ ] `prefers-reduced-motion` respected for new animations
- [ ] No `console.log` left in
- [ ] TypeScript: no `any`, no unused imports
- [ ] `npm run build` passes
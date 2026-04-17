# iDF Hub — Project Rules & Guidelines

> Canonical reference for contributors and AI assistants.
> The machine-readable version lives at `.github/copilot-instructions.md`.

---

## Philosophy

This is a **personal portfolio + playground** — it must be:

1. **Usable on mobile first** — the primary audience browses on phones
2. **Hardware-aware** — exploit gyroscope, touch, vibration, WebGL for genuine wow moments
3. **Accessible** — WCAG AA, keyboard-navigable, screen-reader friendly
4. **Design-system-driven** — every visual decision traces back to a token
5. **Lean and documented** — small files, clear purpose, English everywhere

---

## Rules Summary

See `.github/copilot-instructions.md` for the full rules. Short version:

| # | Rule |
|---|------|
| 1 | All code and docs in **English** |
| 2 | **Mobile-first** — 44px touch targets, gyro/haptics where useful |
| 3 | **WCAG AA** — semantic HTML, keyboard nav, `prefers-reduced-motion` |
| 4 | **Design tokens only** — never hardcode colors, spacing, fonts |
| 5 | **Atomic architecture** — atoms → molecules → organisms → templates |
| 6 | **Max ~200 lines** per file — extract early, document everything |
| 7 | **TypeScript strict** — no `any`, interfaces for props |
| 8 | **SCSS Modules** — BEM-light, tokens imported via `@use`, no inline styles |
| 9 | **Performance** — `next/image`, dynamic imports, CSS transforms |
| 10 | **Animations** — intentional, timed correctly, GPU-friendly |
| 11 | **Supabase** — RLS always on, no service key client-side |
| 12 | **Conventional Commits** — atomic, no secrets, Copilot trailer |
| 13 | **Jest tests** — behavior-driven, co-located, no snapshots |

---

## Brand & Visual Identity

- Primary accent: Volta `#8b5cf6` (light) / `#a78bfa` (dark)
- Secondary accent: Lario `#3b82f6` (light) / `#60a5fa` (dark)
- Background: Silk — `#fafafa` light / `#0a0a0a` dark
- Text: Slate — `#111827` light / `#f3f4f6` dark
- Fonts: Josefin Sans (display), Geist Mono (code/terminal)
- Fusion-4 SVG (`public/assets/brand/fusion-4-face.svg`) = mascot/companion

---

## Folder Structure

```
src/
  app/              ← Next.js App Router pages
  components/
    atoms/          ← Button, Icon, Badge, Tag, Input
    molecules/      ← Card, FormField, NavItem
    organisms/      ← Terminal, Header, ProjectGrid, BrandPage
    templates/      ← Layout wrappers
  hooks/            ← Custom React hooks
  lib/              ← Supabase client, utilities
  styles/           ← _variables.scss, _mixins.scss, globals.scss
  types/            ← Shared TypeScript interfaces
public/
  assets/
    brand/          ← Logo SVGs, fusion patterns, business cards
docs/
  schema.sql        ← Supabase schema (idempotent, safe to re-run)
ai_rules/           ← Design PDFs, this file
.github/
  copilot-instructions.md  ← Machine-readable rules for AI assistants
```

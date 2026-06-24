# Design System Rules

This project uses SCSS modules and shared tokens as the default styling layer.

## Source Of Truth

- Colors, spacing, typography, radii, and breakpoints live in `src/styles/_variables.scss`.
- Runtime theme values are exposed through CSS custom properties such as `--color-bg` and `--color-text`.
- Component-level styling belongs in `*.module.scss` files.

## Required Rules

- Do not use inline `style={{}}` for ordinary visual styling.
- Do not hardcode colors, spacing values, or font sizes when a token exists.
- Prefer semantic class names and data attributes over ad hoc style objects.
- Keep visual variants in SCSS modules, not in component JSX.

## Allowed Exceptions

- `next/og` image response routes can use inline styles because they render static image trees, not DOM nodes.
- Static asset routes and SVG/image generators should read shared runtime tokens from `src/styles/design-system.ts` instead of duplicating palette values.
- Motion libraries may keep style bindings for live transform values when the API requires them.
- Extremely dynamic runtime values should be bridged through CSS custom properties rather than JSX style objects whenever possible.

## Practical Examples

- Use `className` for layout, typography, borders, colors, and spacing.
- Use CSS module modifiers for theme and state changes.
- Use `style.setProperty()` only when a live runtime value must drive a CSS variable.

## Design System Hub

- Token reference: `src/stories/tokens/DesignTokens.mdx`
- Tone of voice reference: `ai_rules/Personal Brand Tone of Voice.md`

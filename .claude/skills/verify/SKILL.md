---
name: verify
description: Build, run, and drive idf-hub to verify changes at the browser surface.
---

# Verifying idf-hub changes

Node runs natively on this machine (Homebrew). If a `node-tool` toolbox
container exists, prefer it; otherwise run npm directly — check with
`command -v toolbox` first.

```bash
npm run dev          # dev server on :3000 (background)
npm run build        # production build
npm test             # jest (CI territory, not verification)
```

## Driving the UI

Prefer the in-app Browser pane (mcp__Claude_Browser__*) pointed at
`http://localhost:3000`. Fallback: playwright chromium-headless-shell at
`~/.cache/ms-playwright` — set up a scratch dir with
`npm install playwright-core` and drive the page with `chromium.launch()`.

Gotchas:
- An "Immersive Audio" modal covers every page on first visit and blocks all
  hover/pointer checks. Dismiss it first: click `[class*="declineBtn"]`
  (getByRole with the button name did not match it).
- The custom cursor only mounts when `(hover: none) and (pointer: coarse)` is
  false; playwright's default blink settings already report a fine pointer.
- Cursor elements: `[class*="cursorDot"]`, `[class*="cursorBlob"]` (inner
  `[class*="blobShape"]` runs the wave morph). They sit at -100,-100 until the
  first mousemove.
- Global magnetism writes inline `translate` on hovered links/buttons; it is
  size-gated (skips elements larger than 320x120), so project rows on /lab must
  NOT get an inline translate while filter buttons must.
- `el.style.translate` normalizes `"0px 0px"` to `"0px"` — compare accordingly.
- The terminal input submits on the React `onKeyDown` "Enter" handler. The
  Browser pane's synthetic `key: "Return"` does NOT trigger it — to run a typed
  command, dispatch a native `KeyboardEvent('keydown', {key:'Enter', bubbles:true})`
  on the `input[type=text]` via `javascript_tool`. Quick-command CTAs only
  populate the input (they don't submit).

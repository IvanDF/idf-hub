---
name: verify
description: Build, run, and drive idf-hub to verify changes at the browser surface.
---

# Verifying idf-hub changes

Host has no node: everything JS runs inside the `node-tool` toolbox container.

```bash
toolbox run -c node-tool sh -c 'npm run dev'          # dev server on :3000 (background)
toolbox run -c node-tool sh -c 'npm run build'        # production build
toolbox run -c node-tool sh -c 'npm test'             # jest (CI territory, not verification)
```

## Driving the UI

Playwright chromium-headless-shell is installed at `~/.cache/ms-playwright`
(runtime libs already dnf-installed in the toolbox). Set up a scratch dir with
`npm install playwright-core`, then drive `http://localhost:3000` with
`chromium.launch()` from a node script run inside the toolbox.

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

/**
 * Injects three static SVG displacement filters into the DOM — one per distress level.
 * Referenced via CSS: filter: url(#idf-ink-wobble) etc.
 * Static (computed once, never animated) — cartographer's hand, not a CAD edge.
 *
 * idf-ink-wobble       scale 4 — display headings, large surfaces, CTA borders
 * idf-ink-wobble-fine  scale 2 — nav links, small labels, dividers, icon strokes
 * idf-ink-wobble-draft scale 7 — draft/tentative/in-progress states
 */
export default function InkFilters() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
    >
      <defs>
        <filter id="idf-ink-wobble" x="-3%" y="-3%" width="106%" height="106%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.04 0.04"
            numOctaves="3"
            seed="2"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="4"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>

        <filter id="idf-ink-wobble-fine" x="-2%" y="-2%" width="104%" height="104%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.04 0.04"
            numOctaves="3"
            seed="2"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="2"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>

        <filter id="idf-ink-wobble-draft" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.03 0.03"
            numOctaves="4"
            seed="5"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="7"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
}

"use client";

import styles from "./BusinessCard.module.scss";

export type CardVariant = "dev" | "creative" | "general" | "maker";

interface BusinessCardProps {
  variant: CardVariant;
  name?: string;
  title?: string;
  email?: string;
  website?: string;
}

const VARIANT_META: Record<CardVariant, { label: string; desc: string }> = {
  dev:      { label: "Developer",  desc: "Tiled logo pattern — systematic, coded" },
  creative: { label: "Creative",   desc: "Face fusion — artistic, identity" },
  general:  { label: "General",    desc: "Mark only — minimal, professional" },
  maker:    { label: "Maker",      desc: "Greca pattern — crafted, structural" },
};

// Shared iDF logo paths (200×200 viewBox from Frame 57)
function LogoPaths({ color = "currentColor" }: { color?: string }) {
  return (
    <>
      <circle cx="80.2" cy="60.46" r="16.05" fill={color} />
      <path
        fillRule="evenodd" clipRule="evenodd"
        d="M51.99 85.2L58.78 85.01C79.28 85.01 95.93 101.61 95.93 122.06L96.02 156.32C96.02 163.13 101.57 168.67 108.4 168.67H113.79V168.64C120.72 168.64 126.18 174.18 126.18 181C126.18 187.82 120.72 193.36 113.79 193.36H108.4C87.9 193.36 71.26 176.76 71.26 156.32L71.16 122.06C71.16 115.24 65.61 109.71 58.78 109.71L51.99 109.9C45.15 109.9 39.6 104.36 39.6 97.54C39.6 90.71 45.15 85.18 51.99 85.18V85.2Z"
        fill={color}
      />
      <path
        fillRule="evenodd" clipRule="evenodd"
        d="M45.61 6.83L129.54 6.64C150.04 6.64 166.69 23.24 166.69 43.68L166.78 119.43C166.78 126.25 142.02 139.88 142.02 119.43L141.92 43.68C141.92 36.87 136.37 31.34 129.54 31.34L45.61 31.53C38.77 31.53 33.22 25.99 33.22 19.16C33.22 12.34 38.77 6.8 45.61 6.8V6.83Z"
        fill={color}
      />
      <path
        fillRule="evenodd" clipRule="evenodd"
        d="M114.93 161.67L129.54 161.86C150.04 161.86 166.69 145.26 166.69 124.81L166.78 87.8C166.78 80.99 142.02 67.36 142.02 87.8L141.92 124.81C141.92 131.63 136.37 137.16 129.54 137.16L114.93 136.97C108.09 136.97 102.54 142.51 102.54 149.33C102.54 156.16 108.09 161.69 114.93 161.69V161.67Z"
        fill={color}
      />
    </>
  );
}

// ── Pattern: DEV — tiled logo grid ──────────────────────────────────────────────
function PatternDev() {
  const positions = [
    [8, 4], [88, 4], [168, 4], [248, 4],
    [48, 74], [128, 74], [208, 74],
    [8, 144], [88, 144], [168, 144], [248, 144],
  ];
  return (
    <g>
      {positions.map(([x, y], i) => (
        <g key={i} transform={`translate(${x},${y}) scale(0.29)`} opacity="0.14">
          <LogoPaths color="#8b5cf6" />
        </g>
      ))}
    </g>
  );
}

// ── Pattern: CREATIVE — fusion-4 face centred ───────────────────────────────────
function PatternCreative() {
  const logo = (
    <>
      <circle cx="86.58" cy="53.83" r="16.05" fill="#8b5cf6" />
      <path fillRule="evenodd" clipRule="evenodd"
        d="M121.17 0.19L37.24 0C16.74 0 0.09 16.6 0.09 37.05L0 112.79C0 119.61 24.77 133.24 24.77 112.79L24.86 37.05C24.86 30.23 30.41 24.7 37.24 24.7L121.17 24.89C128.01 24.89 133.57 19.35 133.57 12.53C133.57 5.7 128.01 0.17 121.17 0.17V0.19Z"
        fill="#8b5cf6" />
      <path fillRule="evenodd" clipRule="evenodd"
        d="M114.79 78.56L108 78.37C87.5 78.37 70.86 94.97 70.86 115.42L70.76 149.68C70.76 156.5 65.21 162.03 58.38 162.03H52.99V162C46.06 162 40.61 167.54 40.61 174.36C40.61 181.19 46.06 186.73 52.99 186.73H58.38C78.88 186.73 95.53 170.13 95.53 149.68L95.62 115.42C95.62 108.6 101.17 103.07 108 103.07L114.79 103.26C121.63 103.26 127.19 97.72 127.19 90.9C127.19 84.08 121.63 78.54 114.79 78.54V78.56Z"
        fill="#8b5cf6" />
      <path fillRule="evenodd" clipRule="evenodd"
        d="M51.85 155.03L37.24 155.22C16.74 155.22 0.09 138.62 0.09 118.18L0 81.16C0 74.35 24.77 60.72 24.77 81.16L24.86 118.18C24.86 124.99 30.41 130.52 37.24 130.52L51.85 130.33C58.69 130.33 64.25 135.87 64.25 142.7C64.25 149.52 58.69 155.06 51.85 155.06V155.03Z"
        fill="#8b5cf6" />
    </>
  );
  return (
    <g transform="translate(30, 14) scale(0.88)" opacity="0.18">
      <g>{logo}</g>
      <g transform="translate(223,0) scale(-1,1)">{logo}</g>
    </g>
  );
}

// ── Pattern: GENERAL — single large faint mark ──────────────────────────────────
function PatternGeneral() {
  return (
    <g transform="translate(92, 6) scale(0.84)" opacity="0.08">
      <LogoPaths color="#8b5cf6" />
    </g>
  );
}

// ── Pattern: MAKER — fusion-1 greca (logo + vertical mirror, tiled) ─────────────
function PatternMaker() {
  const s = 0.5;
  const h = 187 * s;
  return (
    <g opacity="0.16">
      {[60, 220].map((dx) => (
        <g key={dx}>
          <g transform={`translate(${dx}, 10) scale(${s})`}>
            <LogoPaths color="#8b5cf6" />
          </g>
          <g transform={`translate(${dx}, ${10 + h}) scale(${s},${-s}) translate(0,-187)`}>
            <LogoPaths color="#8b5cf6" />
          </g>
        </g>
      ))}
    </g>
  );
}

const PATTERNS: Record<CardVariant, () => React.ReactElement> = {
  dev: PatternDev,
  creative: PatternCreative,
  general: PatternGeneral,
  maker: PatternMaker,
};

// ── Card component ─────────────────────────────────────────────────────────────
export default function BusinessCard({
  variant,
  name    = "Ivan De Falco",
  title   = "Front End Developer & Creative",
  email   = "hi@ivandf.com",
  website = "ivandf.com",
}: BusinessCardProps) {
  const W = 340;
  const H = 216; // 85×54 mm ratio ≈ 1.574
  const Pattern = PATTERNS[variant];
  const meta = VARIANT_META[variant];

  return (
    <div className={styles.wrapper}>
      <div className={styles.meta}>
        <span className={styles.badge}>{meta.label}</span>
        <span className={styles.metaDesc}>{meta.desc}</span>
      </div>

      <div className={styles.cardOuter} data-variant={variant}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          xmlns="http://www.w3.org/2000/svg"
          className={styles.svg}
          role="img"
          aria-label={`${name} — ${meta.label} business card`}
        >
          <defs>
            <clipPath id={`clip-card-${variant}`}>
              <rect width={W} height={H} rx="10" />
            </clipPath>
          </defs>

          {/* Base */}
          <rect width={W} height={H} rx="10" fill="white" />

          {/* Decorative pattern */}
          <g clipPath={`url(#clip-card-${variant})`}>
            <Pattern />
          </g>

          {/* Accent bottom bar */}
          <rect x="0" y={H - 4} width={W} height="4" fill="#8b5cf6" />

          {/* Logo mark — top left */}
          <g transform="translate(20,16) scale(0.115)">
            <LogoPaths color="#8b5cf6" />
          </g>

          {/* iDF wordmark */}
          <text x="46" y="33"
            fontFamily="Josefin Sans, sans-serif"
            fontWeight="700" fontSize="13" letterSpacing="4"
            fill="#8b5cf6">iDF</text>

          {/* Divider */}
          <line x1="20" y1="50" x2={W - 20} y2="50"
            stroke="#8b5cf6" strokeOpacity="0.12" strokeWidth="0.5" />

          {/* Name */}
          <text x="20" y={H - 38}
            fontFamily="Josefin Sans, sans-serif"
            fontWeight="700" fontSize="11" letterSpacing="2.5"
            fill="#111827">{name}</text>

          {/* Title */}
          <text x="20" y={H - 22}
            fontFamily="Josefin Sans, sans-serif"
            fontSize="7.5" letterSpacing="1.5"
            fill="#64748b">{title}</text>

          {/* Email */}
          <text x={W - 20} y={H - 30}
            fontFamily="Josefin Sans, sans-serif"
            fontSize="7.5" letterSpacing="1"
            fill="#64748b" textAnchor="end">{email}</text>

          {/* Website */}
          <text x={W - 20} y={H - 18}
            fontFamily="Josefin Sans, sans-serif"
            fontSize="7.5" letterSpacing="1"
            fill="#8b5cf6" textAnchor="end">{website}</text>
        </svg>
      </div>
    </div>
  );
}

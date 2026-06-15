import styles from "./page.module.scss";

export default function DesignSystemPage() {
  return (
    <main className={styles.page}>
      <div className={styles.hero}>
        <h1 className={styles.title}>Design System</h1>
        <p className={styles.subtitle}>
          Lario &amp; Volta — tokens, type, and color at a glance
        </p>
      </div>

      <div className={styles.cards}>
        {/* Color Palette */}
        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Color Palette</h2>
          <div className={styles.swatches}>
            <div className={styles.swatch} style={{ background: "#8b5cf6" }}>
              <span className={styles.swatchLabel}>Volta</span>
              <span className={styles.swatchValue}>#8b5cf6</span>
            </div>
            <div className={styles.swatch} style={{ background: "#3b82f6" }}>
              <span className={styles.swatchLabel}>Lario</span>
              <span className={styles.swatchValue}>#3b82f6</span>
            </div>
            <div className={styles.swatch} style={{ background: "#111827" }}>
              <span className={styles.swatchLabel}>Ink</span>
              <span className={styles.swatchValue}>#111827</span>
            </div>
            <div className={styles.swatch} style={{ background: "#fafafa", border: "1px solid #e5e7eb" }}>
              <span className={styles.swatchLabel} style={{ color: "#111827" }}>Silk</span>
              <span className={styles.swatchValue} style={{ color: "#111827" }}>#fafafa</span>
            </div>
            <div className={styles.swatch} style={{ background: "#64748b" }}>
              <span className={styles.swatchLabel}>Slate</span>
              <span className={styles.swatchValue}>#64748b</span>
            </div>
          </div>
        </section>

        {/* Typography */}
        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Typography</h2>
          <div className={styles.typeStack}>
            <div className={styles.typeRow}>
              <span className={styles.typeLabel}>Display</span>
              <span className={styles.typeSample} style={{ fontFamily: "var(--font-josefin-sans)", fontWeight: 700, fontSize: "1.5rem", letterSpacing: "0.1em" }}>
                JOSEFIN SANS 700
              </span>
            </div>
            <div className={styles.typeRow}>
              <span className={styles.typeLabel}>Mono</span>
              <span className={styles.typeSample} style={{ fontFamily: "var(--font-geist-mono)", fontSize: "0.9rem" }}>
                Geist Mono 400
              </span>
            </div>
            <div className={styles.typeScale}>
              {[
                { name: "2xs", size: "0.625rem" },
                { name: "xs", size: "0.75rem" },
                { name: "sm", size: "0.875rem" },
                { name: "base", size: "1rem" },
                { name: "lg", size: "1.125rem" },
                { name: "xl", size: "1.25rem" },
                { name: "2xl", size: "1.5rem" },
              ].map(({ name, size }) => (
                <div key={name} className={styles.typeScaleRow}>
                  <code className={styles.typeScaleCode}>{name}</code>
                  <span style={{ fontSize: size }}>The quick brown fox</span>
                  <span className={styles.typeScaleSize}>{size}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Spacing */}
        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Spacing</h2>
          <div className={styles.spacingStack}>
            {[
              { name: "3xs", px: 2 },
              { name: "2xs", px: 4 },
              { name: "xs", px: 8 },
              { name: "sm", px: 12 },
              { name: "md", px: 16 },
              { name: "lg", px: 24 },
              { name: "xl", px: 32 },
              { name: "2xl", px: 48 },
              { name: "3xl", px: 64 },
            ].map(({ name, px }) => (
              <div key={name} className={styles.spacingRow}>
                <code className={styles.spacingName}>${`spacing-${name}`}</code>
                <div className={styles.spacingBar} style={{ width: Math.min(px * 2, 200) }} />
                <span className={styles.spacingPx}>{px}px</span>
              </div>
            ))}
          </div>
        </section>

        {/* Border Radius */}
        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Border Radius</h2>
          <div className={styles.radiusGrid}>
            {[
              { name: "sm", value: "4px" },
              { name: "md", value: "8px" },
              { name: "lg", value: "12px" },
              { name: "xl", value: "16px" },
              { name: "full", value: "9999px" },
            ].map(({ name, value }) => (
              <div key={name} className={styles.radiusItem}>
                <div className={styles.radiusBox} style={{ borderRadius: value }} />
                <code className={styles.radiusLabel}>{name}</code>
                <span className={styles.radiusValue}>{value}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className={styles.footer}>
        <p>
          Tokens defined in <code>src/styles/_variables.scss</code> — every component uses design tokens, never hardcoded values.
        </p>
      </div>
    </main>
  );
}

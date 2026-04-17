"use client";

import BusinessCard, { CardVariant } from "@/components/organisms/BrandPage/BusinessCard";
import LogoMorph from "@/components/atoms/LogoMorph";
import { useTheme } from "@/context/ThemeContext";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./page.module.scss";

const COLORS = [
  { name: "Volta",    hex: "#8b5cf6", role: "Primary accent / brand" },
  { name: "Volta Dark", hex: "#a78bfa", role: "Dark mode accent" },
  { name: "Lario",   hex: "#3b82f6", role: "Secondary / links" },
  { name: "Silk",    hex: "#fafafa", role: "Light background" },
  { name: "Ink",     hex: "#111827", role: "Dark text / background" },
  { name: "Slate",   hex: "#64748b", role: "Muted text" },
];

const CARD_VARIANTS: CardVariant[] = ["dev", "creative", "general", "maker"];

function ColorSwatch({ name, hex, role }: { name: string; hex: string; role: string }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(hex).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <button className={styles.swatch} onClick={copy} title={`Copy ${hex}`}>
      <span className={styles.swatchColor} style={{ background: hex }} />
      <span className={styles.swatchName}>{name}</span>
      <span className={styles.swatchHex}>{copied ? "Copied!" : hex}</span>
      <span className={styles.swatchRole}>{role}</span>
    </button>
  );
}

/**
 * Protected brand-assets page displaying colour swatches and downloadable business-card variants.
 */
export default function BrandPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setAuthed(true);
      } else {
        router.replace(`/admin/login?next=/brand`);
      }
      setLoading(false);
    });
  }, [router]);

  if (loading) {
    return (
      <div className={styles.loading}>
        <span className={styles.loadingDot} />
      </div>
    );
  }

  if (!authed) return null;

  return (
    <div className={styles.page} data-theme={theme}>
      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <header className={styles.hero}>
        <div className={styles.heroLogo}>
          <LogoMorph mode="assemble" color="#8b5cf6" size={80} />
        </div>
        <div className={styles.heroText}>
          <h1 className={styles.heroTitle}>iDF Brand</h1>
          <p className={styles.heroSub}>
            Identity system · Lario &amp; Volta palette · Josefin Sans
          </p>
        </div>
        <a href="/admin" className={styles.backLink}>← Admin</a>
      </header>

      {/* ── Colors ───────────────────────────────────────────────────────────── */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Colors</h2>
        <p className={styles.sectionNote}>Click any swatch to copy the hex value.</p>
        <div className={styles.swatches}>
          {COLORS.map((c) => (
            <ColorSwatch key={c.hex} {...c} />
          ))}
        </div>
      </section>

      {/* ── Typography ───────────────────────────────────────────────────────── */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Typography</h2>
        <div className={styles.typeGrid}>
          <div className={styles.typeCard}>
            <span className={styles.typeLabel}>Display / UI — Josefin Sans</span>
            <p className={`${styles.typeSpecimen} ${styles.typeSpecimenSans}`}>
              ABCDEFGHIJKLMNOPQRSTUVWXYZ<br />
              abcdefghijklmnopqrstuvwxyz<br />
              0123456789
            </p>
            <span className={styles.typeDetail}>700 · UPPERCASE · wide tracking</span>
          </div>
          <div className={styles.typeCard}>
            <span className={styles.typeLabel}>Code / Terminal — Geist Mono</span>
            <p className={`${styles.typeSpecimen} ${styles.typeSpecimenMono}`}>
              ABCDEFGHIJKLMNOPQRSTUVWXYZ<br />
              abcdefghijklmnopqrstuvwxyz<br />
              0123456789 {"{ } ( ) [ ]"}
            </p>
            <span className={styles.typeDetail}>400 · mono · 14px base</span>
          </div>
        </div>
      </section>

      {/* ── Logo variations ──────────────────────────────────────────────────── */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Logo</h2>
        <div className={styles.logoGrid}>
          <div className={styles.logoCard} data-bg="light">
            <Image src="/assets/brand/logo-dark.svg" alt="iDF logo dark" width={80} height={112} className={styles.logoImg} />
            <span className={styles.logoLabel}>On light</span>
          </div>
          <div className={styles.logoCard} data-bg="dark">
            <Image src="/assets/idf-logo.svg" alt="iDF logo light" width={80} height={112} className={styles.logoImg} />
            <span className={styles.logoLabel}>On dark</span>
          </div>
          <div className={styles.logoCard} data-bg="accent">
            <Image src="/assets/idf-logo.svg" alt="iDF logo on accent" width={80} height={112} className={styles.logoImg} />
            <span className={styles.logoLabel}>On accent</span>
          </div>
          <div className={styles.logoCard} data-bg="light">
            <Image src="/assets/brand/logo-horizontal.svg" alt="iDF logo horizontal" width={220} height={80} className={`${styles.logoImg} ${styles.logoImgFull}`} />
            <span className={styles.logoLabel}>Horizontal</span>
          </div>
        </div>

        <div className={styles.fusionGrid}>
          <h3 className={styles.fusionTitle}>Brand Fusions</h3>
          <div className={styles.fusionCycleWrapper}>
            <LogoMorph mode="cycle" size={180} className={styles.fusionCycleAnim} />
          </div>
          <div className={styles.fusionStaticGrid}>
            {[
              { src: "/assets/brand/fusion-1-vertical.svg",   label: "Fusion 1 — Vertical greca" },
              { src: "/assets/brand/fusion-2-diagonal.svg",   label: "Fusion 2 — Diagonal" },
              { src: "/assets/brand/fusion-3-horizontal.svg", label: "Fusion 3 — Horizontal greca" },
              { src: "/assets/brand/fusion-4-face.svg",       label: "Fusion 4 — Face / companion" },
            ].map(({ src, label }) => (
              <div key={src} className={styles.fusionCard}>
                <Image src={src} alt={label} width={120} height={120} className={styles.fusionImg} />
                <span className={styles.logoLabel}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Business Cards ───────────────────────────────────────────────────── */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Business Cards</h2>
        <p className={styles.sectionNote}>
          85×54 mm · Standard ratio · One brand color, four graphic identities.
          Each variant targets a different audience while staying within the same system.
        </p>
        <div className={styles.cardsGrid}>
          {CARD_VARIANTS.map((v) => (
            <BusinessCard key={v} variant={v} />
          ))}
        </div>
      </section>

      {/* ── Assets ───────────────────────────────────────────────────────────── */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Assets</h2>
        <div className={styles.assetList}>
          {[
            { href: "/assets/brand/logo-dark.svg",           label: "Logo mark (dark fill)" },
            { href: "/assets/idf-logo.svg",                   label: "Logo mark (light fill)" },
            { href: "/assets/brand/logo-horizontal.svg",     label: "Logo horizontal" },
            { href: "/assets/brand/logo-vertical.svg",       label: "Logo vertical" },
            { href: "/assets/brand/fusion-1-vertical.svg",   label: "Fusion 1 — Vertical" },
            { href: "/assets/brand/fusion-2-diagonal.svg",   label: "Fusion 2 — Diagonal" },
            { href: "/assets/brand/fusion-3-horizontal.svg", label: "Fusion 3 — Horizontal" },
            { href: "/assets/brand/fusion-4-face.svg",       label: "Fusion 4 — Face" },
          ].map(({ href, label }) => (
            <a key={href} href={href} download className={styles.assetItem} target="_blank" rel="noreferrer">
              <span className={styles.assetIcon}>↓</span>
              <span className={styles.assetLabel}>{label}</span>
              <span className={styles.assetExt}>.svg</span>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}

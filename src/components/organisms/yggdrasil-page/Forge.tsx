import { YGG_FORGE, YGG_PALETTE } from "@/data/yggdrasil";
import styles from "./YggdrasilPage.module.scss";

const swatchId = (name: string) => name.replace(/\s+/g, "-");

/** Themes and configs from the setup, free to take. */
export default function Forge() {
  return (
    <div className={styles.forge}>
      <ul className={styles.palette} aria-label="Shared palette">
        {YGG_PALETTE.map((c) => (
          <li key={c.name} className={styles.swatch} data-swatch={swatchId(c.name)}>
            <span className={styles.swatchChip} aria-hidden="true" />
            <span className={styles.swatchName}>{c.name}</span>
            <code className={styles.swatchHex}>{c.hex}</code>
          </li>
        ))}
      </ul>

      <ul className={styles.forgeItems}>
        {YGG_FORGE.map((item) => (
          <li key={item.id} className={styles.forgeItem} data-status={item.status}>
            <p className={styles.forgeTarget}>
              {item.target}
              {item.status === "forging" && <span className={styles.forgeBadge}>on the anvil</span>}
            </p>
            <h3 className={styles.forgeName}>{item.name}</h3>
            <p className={styles.forgeBody}>{item.body}</p>
            {item.downloads.length > 0 && (
              <p className={styles.forgeLinks}>
                {item.downloads.map((d) => (
                  <a key={d.href} href={d.href} download className={styles.forgeLink}>
                    ↓ {d.label}
                  </a>
                ))}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

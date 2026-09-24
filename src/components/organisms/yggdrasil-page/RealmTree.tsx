"use client";

import { YGG_REALMS } from "@/data/yggdrasil";
import type { YggLayer, YggRealm } from "@/types/yggdrasil";
import { useState } from "react";
import styles from "./YggdrasilPage.module.scss";

const LAYERS: { layer: YggLayer; label: string }[] = [
  { layer: "branches", label: "branches" },
  { layer: "trunk", label: "trunk" },
  { layer: "roots", label: "roots" },
];

/**
 * The system drawn as the world tree, read top-down like the myth: branches
 * (services), the trunk that carries them, the ground it stands on. Each node
 * is a button; the chosen one opens its card below.
 */
export default function RealmTree() {
  const [activeId, setActiveId] = useState<string>("ratatoskr");
  const active = YGG_REALMS.find((r) => r.id === activeId) as YggRealm;

  return (
    <div className={styles.tree}>
      <div className={styles.treeLayers}>
        {LAYERS.map(({ layer, label }) => (
          <div key={layer} className={styles.treeLayer} data-layer={layer}>
            <span className={styles.treeLabel}>{label}</span>
            <ul className={styles.treeNodes}>
              {YGG_REALMS.filter((r) => r.layer === layer).map((realm) => (
                <li key={realm.id}>
                  <button
                    type="button"
                    className={styles.treeNode}
                    aria-pressed={realm.id === activeId}
                    onClick={() => setActiveId(realm.id)}
                  >
                    <span className={styles.treeRune} aria-hidden="true">
                      {realm.rune}
                    </span>
                    {realm.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <article className={styles.realmCard} aria-live="polite">
        <p className={styles.realmMyth}>
          <span className={styles.realmRune} aria-hidden="true">
            {active.rune}
          </span>
          {active.myth}
        </p>
        <h3 className={styles.realmName}>
          {active.name} <span className={styles.realmRole}>— {active.role}</span>
        </h3>
        <p className={styles.realmDetail}>{active.detail}</p>
      </article>
    </div>
  );
}

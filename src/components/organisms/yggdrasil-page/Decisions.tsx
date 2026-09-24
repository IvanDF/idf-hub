import type { ProjectDecision } from "@/types/project";
import styles from "./YggdrasilPage.module.scss";

interface DecisionsProps {
  decisions: ProjectDecision[];
}

/**
 * The decision log, moved here from the generic project page when Yggdrasil
 * stopped having two addresses.
 *
 * It sits after the laws on purpose: the laws are what the system believes,
 * these are the calls that belief forced and what each one cost. A principle
 * with no bill attached is just a slogan.
 *
 * @param decisions - Taken from the project record, so the text has one home.
 */
export default function Decisions({ decisions }: DecisionsProps) {
  if (decisions.length === 0) return null;

  return (
    <ol className={styles.decisions}>
      {decisions.map((d, i) => (
        <li key={d.choice} className={styles.decision}>
          <p className={styles.decisionIndex} aria-hidden="true">
            {String(i + 1).padStart(2, "0")}
          </p>
          <div>
            <h3 className={styles.decisionChoice}>{d.choice}</h3>
            <p className={styles.decisionWhy}>{d.why}</p>
            {d.tradeoff && (
              <p className={styles.decisionCost}>
                <span className={styles.decisionCostTag}>cost</span>
                {d.tradeoff}
              </p>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}

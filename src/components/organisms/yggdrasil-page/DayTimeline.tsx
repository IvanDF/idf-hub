import { YGG_DAY } from "@/data/yggdrasil";
import styles from "./YggdrasilPage.module.scss";

/** The system's daily rhythm, printed like a crontab read aloud. */
export default function DayTimeline() {
  return (
    <ol className={styles.day}>
      {YGG_DAY.map((m) => (
        <li key={m.time} className={styles.dayItem}>
          <span className={styles.dayTime}>{m.time}</span>
          <div>
            <h3 className={styles.dayTitle}>{m.title}</h3>
            <p className={styles.dayBody}>{m.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

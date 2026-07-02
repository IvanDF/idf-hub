"use client";

import Text from "@/components/atoms/text";
import { renderGrid, useSnakeGame } from "@/hooks/terminal/useSnakeGame";
import styles from "./SnakeGame.module.scss";

interface SnakeGameProps {
  onExit: (score: number) => void;
}

/** Thin rendering wrapper around `useSnakeGame`. Handles only JSX output. */
export default function SnakeGame({ onExit }: SnakeGameProps) {
  const {
    phase,
    playerName, setPlayerName,
    submitting,
    board, myRank,
    highScore,
    snake, food, score, started,
    queueDir,
    restart,
    submitScore, loadBoard,
    exit,
    onTouchStart, onTouchEnd,
  } = useSnakeGame({ onExit });

  if (phase === "submit") {
    return (
      <div className={styles.overlay}>
        <div className={styles.panel}>
          <div className={styles.panelTitle}>GAME OVER</div>
          <div className={styles.panelScore}>score: <strong>{score}</strong></div>
          {score > 0 ? (
            <>
              <Text as="p" variant="mono" className={styles.panelHint}>Enter your name for the leaderboard (optional)</Text>
              <input
                className={styles.nameInput}
                type="text"
                maxLength={20}
                placeholder="your name..."
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") submitScore(); }}
                autoFocus
              />
              <div className={styles.panelActions}>
                <button className={styles.btn} onClick={submitScore} disabled={submitting}>
                  {submitting ? "..." : "[ save score ]"}
                </button>
                <button className={styles.btnGhost} onClick={loadBoard}>[ skip ]</button>
              </div>
            </>
          ) : (
            <div className={styles.panelActions}>
              <button className={styles.btn} onClick={loadBoard}>[ see leaderboard ]</button>
            </div>
          )}
          <button className={styles.btnGhost} onClick={exit}>[ exit ]</button>
        </div>
      </div>
    );
  }

  if (phase === "board") {
    return (
      <div className={styles.overlay}>
        <div className={styles.panel}>
          <div className={styles.panelTitle}>── TOP 10 ──</div>
          {myRank && <div className={styles.panelHint}>your rank: #{myRank}</div>}
          <table className={styles.board}>
            <thead><tr><th>#</th><th>name</th><th>score</th></tr></thead>
            <tbody>
              {board.map((s, i) => (
                <tr key={s.id} className={s.score === score && s.name === (playerName || "Anonymous") ? styles.myRow : ""}>
                  <td>{i + 1}</td><td>{s.name}</td><td>{s.score}</td>
                </tr>
              ))}
              {board.length === 0 && (
                <tr><td colSpan={3} className={styles.emptyRow}>no scores yet — be the first!</td></tr>
              )}
            </tbody>
          </table>
          <div className={styles.panelActions}>
            <button className={styles.btn} onClick={restart}>[ play again ]</button>
            <button className={styles.btnGhost} onClick={exit}>[ exit ]</button>
          </div>
        </div>
      </div>
    );
  }

  // Game phase
  const UP_DIR = { x: 0, y: -1 };
  const DOWN_DIR = { x: 0, y: 1 };
  const LEFT_DIR = { x: -1, y: 0 };
  const RIGHT_DIR = { x: 1, y: 0 };

  return (
    <div className={styles.game} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <div className={styles.hud}>
        <Text as="span" variant="mono">SNAKE</Text>
        <Text as="span" variant="mono">score: <strong>{score}</strong></Text>
        <Text as="span" variant="mono">best: {highScore}</Text>
        <Text as="span" variant="mono" className={styles.hudEsc} onClick={exit}>ESC</Text>
      </div>

      <pre className={styles.grid}>{renderGrid(snake, food)}</pre>

      {!started && <div className={styles.startMsg}>tap or swipe to start · WASD or ↑↓←→</div>}

      <div className={styles.dpad}>
        <div className={styles.dpadRow}>
          <button className={styles.dpadBtn} onClick={() => queueDir(UP_DIR)}>▲</button>
        </div>
        <div className={styles.dpadRow}>
          <button className={styles.dpadBtn} onClick={() => queueDir(LEFT_DIR)}>◀</button>
          <button className={styles.dpadBtn} onClick={() => queueDir(DOWN_DIR)}>▼</button>
          <button className={styles.dpadBtn} onClick={() => queueDir(RIGHT_DIR)}>▶</button>
        </div>
      </div>
    </div>
  );
}

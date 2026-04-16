"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import styles from "./SnakeGame.module.scss";

const COLS = 26;
const ROWS = 18;

// ASCII-only chars: guaranteed 1 column wide in any monospace font.
// Unicode block chars (▓▓, ──, │) vary per font and cause the "wall shift" bug.
const HEAD  = ">>";
const BODY  = "##";
const FOOD  = "()";
const EMPTY = "  ";

type Dir   = { x: number; y: number };
type Point = { x: number; y: number };
type Score = { id: number; name: string; score: number };

const UP:    Dir = { x:  0, y: -1 };
const DOWN:  Dir = { x:  0, y:  1 };
const LEFT:  Dir = { x: -1, y:  0 };
const RIGHT: Dir = { x:  1, y:  0 };

const KEY_MAP: Record<string, Dir> = {
  ArrowUp: UP, w: UP, W: UP,
  ArrowDown: DOWN, s: DOWN, S: DOWN,
  ArrowLeft: LEFT, a: LEFT, A: LEFT,
  ArrowRight: RIGHT, d: RIGHT, D: RIGHT,
};

function isOpposite(a: Dir, b: Dir) {
  return a.x === -b.x && a.y === -b.y;
}

function randomFood(snake: Point[]): Point {
  let p: Point;
  do {
    p = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
  } while (snake.some(s => s.x === p.x && s.y === p.y));
  return p;
}

function initState() {
  const snake: Point[] = [
    { x: Math.floor(COLS / 2),     y: Math.floor(ROWS / 2) },
    { x: Math.floor(COLS / 2) - 1, y: Math.floor(ROWS / 2) },
    { x: Math.floor(COLS / 2) - 2, y: Math.floor(ROWS / 2) },
  ];
  return { snake, food: randomFood(snake), dir: RIGHT, pendingDir: RIGHT, score: 0, dead: false, started: false };
}

function renderGrid(snake: Point[], food: Point): string {
  const border = "--".repeat(COLS);
  const rows: string[] = ["+" + border + "+"];
  for (let y = 0; y < ROWS; y++) {
    let row = "|";
    for (let x = 0; x < COLS; x++) {
      if (snake[0].x === x && snake[0].y === y)                        row += HEAD;
      else if (snake.some((s, i) => i > 0 && s.x === x && s.y === y)) row += BODY;
      else if (food.x === x && food.y === y)                           row += FOOD;
      else                                                              row += EMPTY;
    }
    rows.push(row + "|");
  }
  rows.push("+" + border + "+");
  return rows.join("\n");
}

interface SnakeGameProps {
  onExit: (score: number) => void;
}

export default function SnakeGame({ onExit }: SnakeGameProps) {
  // ALL mutable game state in one ref — zero stale closures, zero split-snake
  const g = useRef(initState());
  // Increment to trigger re-render after mutating g.current
  const [, render] = useReducer(n => n + 1, 0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchRef = useRef<{ x: number; y: number } | null>(null);

  const [phase,      setPhase]      = useState<"game" | "submit" | "board">("game");
  const [playerName, setPlayerName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [board,      setBoard]      = useState<Score[]>([]);
  const [myRank,     setMyRank]     = useState<number | null>(null);
  const [highScore,  setHighScore]  = useState(0);

  // Keep phase accessible inside event listeners without re-binding
  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  useEffect(() => {
    fetch("/api/snake")
      .then(r => r.json())
      .then((data: unknown) => {
        if (Array.isArray(data) && data.length > 0) setHighScore(data[0].score);
      })
      .catch(() => {});
  }, []);

  const stopLoop = () => {
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
  };

  // tick reads/writes g.current directly — no closures over React state
  const tick = () => {
    const s = g.current;
    if (s.dead) return;

    // Apply pending direction — guard against 180° reverse
    if (!isOpposite(s.pendingDir, s.dir)) s.dir = s.pendingDir;

    const head = { x: s.snake[0].x + s.dir.x, y: s.snake[0].y + s.dir.y };

    if (
      head.x < 0 || head.x >= COLS ||
      head.y < 0 || head.y >= ROWS ||
      s.snake.some(p => p.x === head.x && p.y === head.y)
    ) {
      s.dead = true;
      render();
      setPhase("submit");
      return;
    }

    const ate = head.x === s.food.x && head.y === s.food.y;
    s.snake = ate ? [head, ...s.snake] : [head, ...s.snake.slice(0, -1)];
    if (ate) { s.score += 10; s.food = randomFood(s.snake); }

    render();
    timerRef.current = setTimeout(tick, Math.max(70, 200 - s.score * 1.5));
  };

  const startLoop = () => {
    stopLoop();
    timerRef.current = setTimeout(tick, Math.max(70, 200 - g.current.score * 1.5));
  };

  // Queue a direction change.
  // Critical: check against pendingDir, NOT dir — prevents left+right rapid-press bug.
  const queueDir = (newDir: Dir) => {
    if (!isOpposite(newDir, g.current.pendingDir)) {
      g.current.pendingDir = newDir;
    }
    if (!g.current.started && !g.current.dead) {
      g.current.started = true;
      render();
      startLoop();
    }
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (phaseRef.current !== "game") return;
      if (e.key === "Escape") { stopLoop(); onExit(g.current.score); return; }
      const newDir = KEY_MAP[e.key];
      if (newDir) {
        e.preventDefault();
        queueDir(newDir);
      } else if (!g.current.started && !g.current.dead) {
        g.current.started = true;
        render();
        startLoop();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("keydown", onKey); stopLoop(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onExit]);

  const loadBoard = async () => {
    try {
      const raw = await fetch("/api/snake").then(r => r.json());
      const scores: Score[] = Array.isArray(raw) ? raw : [];
      setBoard(scores);
      const rank = scores.findIndex(s => s.score < g.current.score);
      setMyRank(rank === -1 ? scores.length + 1 : rank + 1);
    } catch { setBoard([]); }
    setPhase("board");
  };

  const submitScore = async () => {
    setSubmitting(true);
    try {
      await fetch("/api/snake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: playerName || "Anonymous", score: g.current.score }),
      });
    } catch { /* still show board */ }
    await loadBoard();
    setSubmitting(false);
  };

  const restart = () => {
    stopLoop();
    g.current = initState();
    render();
    setPhase("game");
    setMyRank(null);
    setPlayerName("");
  };

  const { snake, food, score, started } = g.current;

  // ── Submit phase ──────────────────────────────────
  if (phase === "submit") {
    return (
      <div className={styles.overlay}>
        <div className={styles.panel}>
          <div className={styles.panelTitle}>GAME OVER</div>
          <div className={styles.panelScore}>score: <strong>{score}</strong></div>
          {score > 0 ? (
            <>
              <p className={styles.panelHint}>Enter your name for the leaderboard (optional)</p>
              <input
                className={styles.nameInput}
                type="text"
                maxLength={20}
                placeholder="your name..."
                value={playerName}
                onChange={e => setPlayerName(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") submitScore(); }}
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
          <button className={styles.btnGhost} onClick={() => { stopLoop(); onExit(g.current.score); }}>
            [ exit ]
          </button>
        </div>
      </div>
    );
  }

  // ── Leaderboard phase ─────────────────────────────
  if (phase === "board") {
    return (
      <div className={styles.overlay}>
        <div className={styles.panel}>
          <div className={styles.panelTitle}>🏆 TOP 10</div>
          {myRank && <div className={styles.panelHint}>your rank: #{myRank}</div>}
          <table className={styles.board}>
            <thead><tr><th>#</th><th>name</th><th>score</th></tr></thead>
            <tbody>
              {board.map((s, i) => (
                <tr
                  key={s.id}
                  className={s.score === g.current.score && s.name === (playerName || "Anonymous") ? styles.myRow : ""}
                >
                  <td>{i + 1}</td>
                  <td>{s.name}</td>
                  <td>{s.score}</td>
                </tr>
              ))}
              {board.length === 0 && (
                <tr>
                  <td colSpan={3} style={{ textAlign: "center", opacity: 0.5 }}>no scores yet — be the first!</td>
                </tr>
              )}
            </tbody>
          </table>
          <div className={styles.panelActions}>
            <button className={styles.btn} onClick={restart}>[ play again ]</button>
            <button className={styles.btnGhost} onClick={() => { stopLoop(); onExit(g.current.score); }}>[ exit ]</button>
          </div>
        </div>
      </div>
    );
  }

  // ── Game phase ────────────────────────────────────
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchRef.current = { x: t.clientX, y: t.clientY };
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchRef.current || phaseRef.current !== "game") return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchRef.current.x;
    const dy = t.clientY - touchRef.current.y;
    touchRef.current = null;
    if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return; // tap — just start
    if (Math.abs(dx) >= Math.abs(dy)) {
      queueDir(dx > 0 ? RIGHT : LEFT);
    } else {
      queueDir(dy > 0 ? DOWN : UP);
    }
  };

  return (
    <div
      className={styles.game}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className={styles.hud}>
        <span>SNAKE</span>
        <span>score: <strong>{score}</strong></span>
        <span>best: {highScore}</span>
        <span className={styles.hudEsc} onClick={() => { stopLoop(); onExit(g.current.score); }}>ESC</span>
      </div>

      <pre className={styles.grid}>{renderGrid(snake, food)}</pre>

      {!started && <div className={styles.startMsg}>tap or swipe to start · WASD or ↑↓←→</div>}

      <div className={styles.dpad}>
        <div className={styles.dpadRow}>
          <button className={styles.dpadBtn} onClick={() => queueDir(UP)}>▲</button>
        </div>
        <div className={styles.dpadRow}>
          <button className={styles.dpadBtn} onClick={() => queueDir(LEFT)}>◀</button>
          <button className={styles.dpadBtn} onClick={() => queueDir(DOWN)}>▼</button>
          <button className={styles.dpadBtn} onClick={() => queueDir(RIGHT)}>▶</button>
        </div>
      </div>
    </div>
  );
}

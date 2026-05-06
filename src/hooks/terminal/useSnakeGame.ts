"use client";

import type React from "react";
import { useEffect, useReducer, useRef, useState } from "react";

const COLS = 26;
const ROWS = 18;

const HEAD = ">>";
const BODY = "##";
const FOOD = "()";
const EMPTY = "  ";

type Dir = { x: number; y: number };
type Point = { x: number; y: number };
export type Score = { id: number; name: string; score: number };

const UP: Dir = { x: 0, y: -1 };
const DOWN: Dir = { x: 0, y: 1 };
const LEFT: Dir = { x: -1, y: 0 };
const RIGHT: Dir = { x: 1, y: 0 };

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
  } while (snake.some((s) => s.x === p.x && s.y === p.y));
  return p;
}

function initState() {
  const snake: Point[] = [
    { x: Math.floor(COLS / 2), y: Math.floor(ROWS / 2) },
    { x: Math.floor(COLS / 2) - 1, y: Math.floor(ROWS / 2) },
    { x: Math.floor(COLS / 2) - 2, y: Math.floor(ROWS / 2) },
  ];
  return { snake, food: randomFood(snake), dir: RIGHT, pendingDir: RIGHT, score: 0, dead: false, started: false };
}

/** Renders the game grid as a string for display in a `<pre>` element. */
export function renderGrid(snake: Point[], food: Point): string {
  const border = "--".repeat(COLS);
  const rows: string[] = ["+" + border + "+"];
  for (let y = 0; y < ROWS; y++) {
    let row = "|";
    for (let x = 0; x < COLS; x++) {
      if (snake[0].x === x && snake[0].y === y) row += HEAD;
      else if (snake.some((s, i) => i > 0 && s.x === x && s.y === y)) row += BODY;
      else if (food.x === x && food.y === y) row += FOOD;
      else row += EMPTY;
    }
    rows.push(row + "|");
  }
  rows.push("+" + border + "+");
  return rows.join("\n");
}

type SnakeGameOptions = {
  onExit: (score: number) => void;
};

/**
 * Encapsulates all snake game state, tick logic, input handling, and score submission.
 * Returns rendering data and action callbacks for use by `SnakeGame.tsx`.
 */
export function useSnakeGame({ onExit }: SnakeGameOptions) {
  const g = useRef(initState());
  const [, render] = useReducer((n: number) => n + 1, 0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchRef = useRef<{ x: number; y: number } | null>(null);

  const [phase, setPhase] = useState<"game" | "submit" | "board">("game");
  const [playerName, setPlayerName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [board, setBoard] = useState<Score[]>([]);
  const [myRank, setMyRank] = useState<number | null>(null);
  const [highScore, setHighScore] = useState(0);

  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  useEffect(() => {
    fetch("/api/snake")
      .then((r) => r.json())
      .then((data: unknown) => {
        if (Array.isArray(data) && data.length > 0) setHighScore(data[0].score);
      })
      .catch(() => {});
  }, []);

  const stopLoop = () => {
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
  };

  const tick = () => {
    const s = g.current;
    if (s.dead) return;
    if (!isOpposite(s.pendingDir, s.dir)) s.dir = s.pendingDir;
    const head = { x: s.snake[0].x + s.dir.x, y: s.snake[0].y + s.dir.y };
    if (
      head.x < 0 || head.x >= COLS ||
      head.y < 0 || head.y >= ROWS ||
      s.snake.some((p) => p.x === head.x && p.y === head.y)
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

  const queueDir = (newDir: Dir) => {
    if (!isOpposite(newDir, g.current.pendingDir)) g.current.pendingDir = newDir;
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
      const raw = await fetch("/api/snake").then((r) => r.json());
      const scores: Score[] = Array.isArray(raw) ? raw : [];
      setBoard(scores);
      const rank = scores.findIndex((s) => s.score < g.current.score);
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
    if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return;
    if (Math.abs(dx) >= Math.abs(dy)) queueDir(dx > 0 ? RIGHT : LEFT);
    else queueDir(dy > 0 ? DOWN : UP);
  };

  return {
    phase,
    playerName,
    setPlayerName,
    submitting,
    board,
    myRank,
    highScore,
    snake: g.current.snake,
    food: g.current.food,
    score: g.current.score,
    started: g.current.started,
    queueDir,
    restart,
    submitScore,
    loadBoard,
    exit: () => { stopLoop(); onExit(g.current.score); },
    onTouchStart,
    onTouchEnd,
  };
}

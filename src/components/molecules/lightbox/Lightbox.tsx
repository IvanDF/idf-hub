"use client";

import Text from "@/components/atoms/text";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./Lightbox.module.scss";

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;
const DBLCLICK_ZOOM = 2.5;

interface LightboxProps {
  images: string[];
  title: string;
  index: number;
  onNavigate: (index: number) => void;
  onClose: () => void;
}

/**
 * Fullscreen image viewer with zoom and pan.
 * Wheel / pinch to zoom (1x-4x), drag to pan while zoomed, double click to
 * toggle, arrows to navigate, Escape or backdrop click to close.
 * Rendered in a portal so transformed route-transition ancestors cannot break
 * the fixed positioning.
 */
export default function Lightbox({
  images,
  title,
  index,
  onNavigate,
  onClose,
}: LightboxProps) {
  const [zoom, setZoom] = useState(MIN_ZOOM);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);

  const stageRef = useRef<HTMLDivElement>(null);
  const pointersRef = useRef(new Map<number, { x: number; y: number }>());
  const pinchRef = useRef<{ dist: number; zoom: number } | null>(null);

  const zoomRef = useRef(zoom);
  useEffect(() => {
    zoomRef.current = zoom;
  }, [zoom]);

  const clampOffset = useCallback((next: { x: number; y: number }, z: number) => {
    // Keep the image from being dragged fully out of the stage.
    const stage = stageRef.current;
    const maxX = stage ? ((z - 1) * stage.clientWidth) / 2 : 0;
    const maxY = stage ? ((z - 1) * stage.clientHeight) / 2 : 0;
    return {
      x: Math.max(-maxX, Math.min(maxX, next.x)),
      y: Math.max(-maxY, Math.min(maxY, next.y)),
    };
  }, []);

  const applyZoom = useCallback(
    (next: number) => {
      const z = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, next));
      setZoom(z);
      setOffset((prev) => (z === MIN_ZOOM ? { x: 0, y: 0 } : clampOffset(prev, z)));
    },
    [clampOffset],
  );

  const resetView = useCallback(() => {
    setZoom(MIN_ZOOM);
    setOffset({ x: 0, y: 0 });
  }, []);

  // Fresh frame, fresh view (derived-state reset during render, no effect).
  const [lastIndex, setLastIndex] = useState(index);
  if (lastIndex !== index) {
    setLastIndex(index);
    setZoom(MIN_ZOOM);
    setOffset({ x: 0, y: 0 });
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.stopPropagation(); onClose(); }
      else if (e.key === "ArrowLeft" && images.length > 1)
        onNavigate((index - 1 + images.length) % images.length);
      else if (e.key === "ArrowRight" && images.length > 1)
        onNavigate((index + 1) % images.length);
      else if (e.key === "+" || e.key === "=") applyZoom(zoomRef.current * 1.25);
      else if (e.key === "-") applyZoom(zoomRef.current / 1.25);
      else return;
      e.preventDefault();
    };
    // Capture phase so the terminal's global Escape handling never races us.
    window.addEventListener("keydown", onKey, { capture: true });
    return () => window.removeEventListener("keydown", onKey, { capture: true });
  }, [images.length, index, onNavigate, onClose, applyZoom]);

  // Native wheel listener: React's synthetic one can be passive, and the
  // zoom must preventDefault to keep the page from scrolling underneath.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      applyZoom(zoomRef.current * (e.deltaY < 0 ? 1.15 : 1 / 1.15));
    };
    stage.addEventListener("wheel", onWheel, { passive: false });
    return () => stage.removeEventListener("wheel", onWheel);
  }, [applyZoom]);

  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointersRef.current.size === 2) {
      const [a, b] = [...pointersRef.current.values()];
      pinchRef.current = { dist: Math.hypot(a.x - b.x, a.y - b.y), zoom: zoomRef.current };
    } else if (zoomRef.current > MIN_ZOOM) {
      setDragging(true);
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const prev = pointersRef.current.get(e.pointerId);
    if (!prev) return;
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointersRef.current.size === 2 && pinchRef.current) {
      const [a, b] = [...pointersRef.current.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      applyZoom((pinchRef.current.zoom * dist) / Math.max(pinchRef.current.dist, 1));
    } else if (pointersRef.current.size === 1 && zoomRef.current > MIN_ZOOM) {
      const dx = e.clientX - prev.x;
      const dy = e.clientY - prev.y;
      setOffset((o) => clampOffset({ x: o.x + dx, y: o.y + dy }, zoomRef.current));
    }
  };

  const onPointerUp = (e: React.PointerEvent) => {
    pointersRef.current.delete(e.pointerId);
    if (pointersRef.current.size < 2) pinchRef.current = null;
    if (pointersRef.current.size === 0) setDragging(false);
  };

  const onDoubleClick = () => {
    if (zoomRef.current > MIN_ZOOM) resetView();
    else applyZoom(DBLCLICK_ZOOM);
  };

  const frameName =
    images[index]?.split("/").pop()?.split(".")[0]?.replace(/-/g, " ") ?? title;

  return createPortal(
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-label={`${title} gallery`}
      onClick={onClose}
    >
      <div className={styles.topBar} onClick={(e) => e.stopPropagation()}>
        <Text as="span" variant="label" className={styles.frameName}>
          {frameName}
        </Text>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close viewer">
          ESC ×
        </button>
      </div>

      <div
        ref={stageRef}
        className={styles.stage}
        data-dragging={dragging || undefined}
        data-zoomed={zoom > MIN_ZOOM || undefined}
        onClick={(e) => e.stopPropagation()}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onDoubleClick={onDoubleClick}
      >
        <div
          className={styles.canvas}
          style={{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})` }}
        >
          <Image
            src={images[index]}
            alt={`${title} - frame ${index + 1}`}
            fill
            sizes="100vw"
            className={styles.image}
            priority
            draggable={false}
          />
        </div>
      </div>

      <div className={styles.bottomBar} onClick={(e) => e.stopPropagation()}>
        {images.length > 1 ? (
          <>
            <button
              className={styles.navBtn}
              onClick={() => onNavigate((index - 1 + images.length) % images.length)}
              aria-label="Previous image"
            >
              ←
            </button>
            <Text as="span" variant="label" className={styles.counter}>
              {String(index + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
            </Text>
            <button
              className={styles.navBtn}
              onClick={() => onNavigate((index + 1) % images.length)}
              aria-label="Next image"
            >
              →
            </button>
          </>
        ) : (
          <Text as="span" variant="label" className={styles.counter}>
            scroll to zoom · drag to pan
          </Text>
        )}
      </div>
    </div>,
    document.body,
  );
}

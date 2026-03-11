'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { usePathname } from 'next/navigation';

/**
 * CustomCursor Component
 * 
 * Replaces the default system cursor with an interactive, animated cursor.
 * Features:
 * - Central dot that follows mouse instantly
 * - Outer ring with spring physics (magnetic feel)
 * - Hover state (scales up)
 * - Click state (pulses)
 * - Disappears on touch devices
 */
export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  
  const pathname = usePathname();

  // Mouse position state
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Spring physics for the outer ring (delayed follow)
  const springConfig = { damping: 25, stiffness: 300 };
  const ringX = useSpring(mouseX, springConfig);
  const ringY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Only enable on desktop devices
    const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    if (isTouchDevice) return;

    // eslint-disable-next-line
    setIsVisible(true);

    const moveCursor = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Check for interactive elements
      if (
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.closest('a') || 
        target.closest('button') ||
        target.getAttribute('role') === 'button' ||
        getComputedStyle(target).cursor === 'pointer'
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [mouseX, mouseY]);

  // Reset hover state on navigation
  useEffect(() => {
    // eslint-disable-next-line
    setIsHovering(false);
    // eslint-disable-next-line
    setIsClicking(false);
  }, [pathname]);

  if (!isVisible) return null;

  return (
    <>
      {/* Central Dot (Instant Follow) */}
      <motion.div
        style={{
          translateX: mouseX,
          translateY: mouseY,
          x: '-50%',
          y: '-50%',
          position: 'fixed',
          top: 0,
          left: 0,
          width: 8,
          height: 8,
          backgroundColor: '#FFFFFF', // Force white for difference mode
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 10000,
          mixBlendMode: 'difference', // Ensure visibility on all backgrounds
        }}
        animate={{
          scale: isClicking ? 0.8 : isHovering ? 0.5 : 1, // Shrink slightly on hover/click
        }}
        transition={{ duration: 0.1 }}
      />

      {/* Outer Ring (Spring Follow) */}
      <motion.div
        style={{
          translateX: ringX,
          translateY: ringY,
          x: '-50%',
          y: '-50%',
          position: 'fixed',
          top: 0,
          left: 0,
          width: 40,
          height: 40,
          border: '1px solid #FFFFFF', // Force white for difference mode
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 9999,
          mixBlendMode: 'difference',
          backgroundColor: 'transparent',
        }}
        animate={{
          scale: isClicking ? 0.8 : isHovering ? 1.5 : 1, // Expand on hover
          opacity: isHovering ? 0.8 : 0.4,
          borderWidth: isHovering ? '2px' : '1px',
        }}
        transition={{
          scale: { duration: 0.2 },
          opacity: { duration: 0.2 }
        }}
      />
    </>
  );
}

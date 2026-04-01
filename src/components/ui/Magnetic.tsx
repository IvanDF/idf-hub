"use client";

import { motion } from "framer-motion";
import React, { useRef, useState } from "react";

interface MagneticProps {
  children: React.ReactElement<{ className?: string }>;
  strength?: number; // How much it moves (default: 0.5)
}

export default function Magnetic({ children, strength = 0.5 }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current!.getBoundingClientRect();

    // Calculate distance from center
    const x = (clientX - (left + width / 2)) * strength;
    const y = (clientY - (top + height / 2)) * strength;

    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseEnter = () => {};

  const { x, y } = position;

  // Clone children to ensure they don't have conflicting styles if needed,
  // but mostly we wrap them.
  // We ensure the child has no cursor so our custom one shows.
  const child = React.cloneElement(children, {
    className: `${children.props.className || ""} cursor-none`.trim(),
  });

  return (
    <motion.div
      data-local-magnetic="true"
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      animate={{ x, y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      style={{ display: "inline-block" }} // Ensure it wraps correctly
    >
      {child}
    </motion.div>
  );
}

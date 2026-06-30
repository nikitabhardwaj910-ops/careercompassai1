import React, { useRef, useState } from "react";
import { HTMLMotionProps, motion } from "framer-motion";

export function HoverSpotlightCard({ 
  children, 
  className = "", 
  ...props 
}: { 
  children: React.ReactNode; 
  className?: string; 
} & HTMLMotionProps<"div">) {
  const divRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current || isFocused) return;

    const div = divRef.current;
    const rect = div.getBoundingClientRect();

    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleFocus = () => {
    setIsFocused(true);
    setOpacity(1);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setOpacity(0);
  };

  const handleMouseEnter = () => {
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <motion.div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden rounded-3xl border border-border/80 bg-card/45 backdrop-blur-xl shadow-card transition-colors hover:border-primary/50 ${className}`}
      {...props}
    >
      <motion.div
        animate={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(var(--color-primary), 0.08), transparent 40%)`,
        }}
        transition={{ duration: 0.2 }}
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 z-0"
      />
      <div className="relative z-10 h-full">{children}</div>
    </motion.div>
  );
}

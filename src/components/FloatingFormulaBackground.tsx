"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";

interface FloatingFormulaBackgroundProps {
  formulas: string[];
  balloonColors: { bg: string; text: string; glow: string }[];
  density?: number;
}

export default function FloatingFormulaBackground({ formulas, balloonColors, density = 20 }: FloatingFormulaBackgroundProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const elements = useMemo(() => {
    return Array.from({ length: density }).map((_, i) => {
      const formula = formulas[i % formulas.length];
      const colorTheme = balloonColors[i % balloonColors.length];
      return {
        id: i,
        text: formula,
        colorTheme,
        left: `${Math.random() * 90 + 5}%`,
        duration: Math.random() * 40 + 40, // Slower, ultra-smooth relaxing float (40-80s)
        delay: Math.random() * -60, // Negative delay so the screen is full on load
        scale: Math.random() * 0.4 + 0.8, // 0.8x to 1.2x size
        xOffset: Math.random() * 60 - 30, // Left/Right wobble drift
        rotStart: Math.random() * -10, // Gentle tilt
        rotEnd: Math.random() * 10,
      };
    });
  }, [formulas, balloonColors, density]);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none select-none z-0">
      {/* Deep Space Grid */}
      <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(circle, #a1a1aa 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

      {/* Glowing Floating Elements */}
      {elements.map((el) => (
        <motion.div
          key={el.id}
          className={`absolute px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-md font-mono text-sm sm:text-base border border-white/10 ${el.colorTheme.bg} ${el.colorTheme.text} pointer-events-auto cursor-crosshair transition-all duration-300`}
          style={{ 
            left: el.left, 
            bottom: "-15%", 
            scale: el.scale,
          }}
          whileHover={{ 
            scale: el.scale * 1.25, 
            zIndex: 50,
            boxShadow: `0 0 40px ${el.colorTheme.glow || 'rgba(255,255,255,0.2)'}`,
            borderColor: 'rgba(255,255,255,0.4)',
            transition: { duration: 0.3, ease: "easeOut" }
          }}
          animate={{
            y: ["0vh", "-120vh"],
            x: [0, el.xOffset, -el.xOffset, 0],
            rotate: [el.rotStart, el.rotEnd, el.rotStart],
            opacity: [0, 0.8, 0.8, 0]
          }}
          transition={{
            y: { duration: el.duration, repeat: Infinity, ease: "linear", delay: el.delay },
            x: { duration: el.duration * 0.6, repeat: Infinity, ease: "easeInOut", repeatType: "mirror", delay: el.delay },
            rotate: { duration: el.duration * 0.4, repeat: Infinity, ease: "easeInOut", repeatType: "mirror", delay: el.delay },
            opacity: { duration: el.duration, repeat: Infinity, ease: "linear", delay: el.delay }
          }}
        >
          {/* Glassmorphic Shine inside the bubble */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none rounded-2xl" />
          <span className="relative z-10 font-bold tracking-wide drop-shadow-md">{el.text}</span>
        </motion.div>
      ))}

      {/* Heavy Vignette to keep focus on the center UI */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#09090b_85%)] pointer-events-none" />
    </div>
  );
}

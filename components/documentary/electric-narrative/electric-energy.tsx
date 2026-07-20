"use client"

/**
 * ElectricEnergy — the visual thread of the documentary (Document 2, Ch. 7).
 * -----------------------------------------------------------------------------
 * Not a character: a living stream of electrical energy that opens the film and
 * reappears as a narrative thread. Its presence is now expressed cinematically
 * with a soft glowing core, breathing halos and a few gentle orbiting motes —
 * NOT permanent lightning rays, which read as noisy and unnatural. The result
 * is a cleaner, more elegant "living light".
 */

import { motion } from "motion/react"
import { useMemo } from "react"

interface ElectricEnergyProps {
  /** Position as viewport percentages. */
  x: number
  y: number
  /** Overall size in px of the energy core. */
  size?: number
  /** Number of orbiting motes (scaled by performance tier). */
  filaments?: number
  /** Slightly dim the entity when it is guiding rather than revealing. */
  intensity?: number
}

export function ElectricEnergy({
  x,
  y,
  size = 90,
  filaments = 5,
  intensity = 1,
}: ElectricEnergyProps) {
  const motes = useMemo(
    () =>
      Array.from({ length: filaments }).map((_, i) => ({
        radius: size * (0.85 + (i % 3) * 0.28),
        duration: 7 + (i % 4) * 2.5,
        delay: i * 0.5,
        dir: i % 2 === 0 ? 1 : -1,
        dot: 3 + (i % 2) * 1.5,
      })),
    [filaments, size],
  )

  return (
    <motion.div
      className="pointer-events-none absolute"
      style={{ left: `${x}%`, top: `${y}%`, translateX: "-50%", translateY: "-50%" }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: intensity }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 14 }}
    >
      {/* Outer breathing halo — soft luminous distortion, replaces the rays. */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: size * 3,
          height: size * 3,
          background:
            "radial-gradient(circle, color-mix(in oklch, var(--electric-blue), transparent 82%) 0%, transparent 62%)",
        }}
        animate={{ scale: [1, 1.18, 1], opacity: [0.35, 0.6, 0.35] }}
        transition={{ duration: 4.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />

      {/* Inner breathing halo — a warmer second layer for depth. */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: size * 1.7,
          height: size * 1.7,
          background:
            "radial-gradient(circle, color-mix(in oklch, var(--electric-yellow), transparent 80%) 0%, transparent 60%)",
        }}
        animate={{ scale: [1.05, 0.92, 1.05], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 3.2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />

      {/* Gentle orbiting motes — small particles of light, never harsh sparks. */}
      {motes.map((m, i) => (
        <motion.div
          key={i}
          className="absolute left-1/2 top-1/2"
          style={{ width: 0, height: 0 }}
          animate={{ rotate: m.dir > 0 ? [0, 360] : [360, 0] }}
          transition={{
            duration: m.duration,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
            delay: m.delay,
          }}
        >
          <motion.span
            className="electric-glow absolute rounded-full"
            style={{
              width: m.dot,
              height: m.dot,
              background: "var(--electric-blue)",
              left: m.radius,
              top: 0,
            }}
            animate={{ opacity: [0.25, 0.85, 0.25] }}
            transition={{
              duration: 2.4,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: m.delay,
            }}
          />
        </motion.div>
      ))}

      {/* Soft glowing core with continuous organic oscillation */}
      <motion.div
        className="electric-glow relative rounded-full"
        style={{
          width: size,
          height: size,
          background:
            "radial-gradient(circle at 50% 45%, color-mix(in oklch, var(--electric-yellow), white 20%) 0%, var(--electric-blue) 48%, transparent 74%)",
        }}
        animate={{
          scale: [1, 1.08, 0.96, 1.04, 1],
          x: [0, 3, -2, 2, 0],
          y: [0, -3, 2, -1, 0],
        }}
        transition={{
          duration: 3.2,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  )
}

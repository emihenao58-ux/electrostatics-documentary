"use client"

/**
 * ParticleField — ambient charged particles drifting across the stage.
 * Part of the Electric Narrative visual language; density is scaled by the
 * Performance Manager's quality tier (Document 2, Ch. 14) so the field stays
 * fluid on every device without the viewer noticing any change.
 */

import { motion } from "motion/react"
import { useMemo } from "react"

interface ParticleFieldProps {
  /** 0..1 particle budget multiplier from the Performance Manager. */
  density?: number
  /** Base color of the drifting particles. */
  tint?: "blue" | "yellow" | "mixed"
}

export function ParticleField({ density = 1, tint = "mixed" }: ParticleFieldProps) {
  const count = Math.max(6, Math.round(34 * density))

  const particles = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => {
        const isYellow =
          tint === "yellow" || (tint === "mixed" && i % 4 === 0)
        return {
          left: (i * 37.5) % 100,
          top: (i * 61.3) % 100,
          size: 1.5 + (i % 4),
          duration: 6 + (i % 7) * 1.5,
          delay: (i % 10) * 0.6,
          drift: (i % 2 === 0 ? 1 : -1) * (12 + (i % 5) * 6),
          color: isYellow ? "var(--electric-yellow)" : "var(--electric-blue)",
        }
      }),
    [count, tint],
  )

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {particles.map((p, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            background: p.color,
            boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
          }}
          animate={{
            y: [0, p.drift, 0],
            x: [0, p.drift * 0.5, 0],
            opacity: [0, 0.7, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}

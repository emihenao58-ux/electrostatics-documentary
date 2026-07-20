"use client"

/**
 * TransitionOverlay — renders the visual cover for scene changes.
 * The engine's TransitionManager owns the timing; this component only paints
 * the current transition's progress. Types map to the cinematic vocabulary in
 * Document 1, §15 (fade to black/white, dissolve, pan, zoom).
 */

import { motion } from "motion/react"
import type { TransitionState } from "@/lib/documentary/types"

export function TransitionOverlay({ transition }: { transition: TransitionState }) {
  const { active, type, progress } = transition
  // Cover rises to full at the swap midpoint, then recedes.
  const cover = active ? 1 - Math.abs(progress - 0.5) * 2 : 0

  if (!active && cover === 0) return null

  const color =
    type === "fade-white" ? "var(--electric-white, #f5f9ff)" : "var(--stage-deep)"

  return (
    <div className="pointer-events-none absolute inset-0 z-40" aria-hidden="true">
      <motion.div
        className="absolute inset-0"
        style={{ background: color }}
        animate={{ opacity: cover }}
        transition={{ duration: 0.12, ease: "linear" }}
      />
      {type === "dissolve" && (
        <motion.div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, color-mix(in oklch, var(--electric-blue), transparent 40%) 0%, transparent 60%)",
          }}
          animate={{ opacity: cover * 0.8 }}
          transition={{ duration: 0.12, ease: "linear" }}
        />
      )}
    </div>
  )
}

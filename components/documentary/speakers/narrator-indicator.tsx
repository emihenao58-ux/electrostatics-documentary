"use client"

/**
 * Presenters — the two permanent hosts of the documentary.
 * -----------------------------------------------------------------------------
 * These are NOT electric charges and never part of the science. They are the
 * narrators who guide the viewer through the whole film:
 *   - Emiliano = blue orb (left)
 *   - Isabela  = pink orb (right)
 *
 * Their identity is fixed for the entire documentary (same blue, same pink,
 * same personality). They float continuously, drift softly, and lean toward the
 * stage when they speak — giving them presence and personality without ever
 * blocking or competing with the scientific demonstration. No permanent rays or
 * sparks: presence is carried by a soft core, a breathing halo and a couple of
 * gentle orbiting motes (clean and cinematic).
 */

import { motion } from "motion/react"
import type { NarratorId } from "@/lib/documentary/types"

interface PresenterProps {
  color: string
  glow: string
  /** Which side of the stage the host lives on. */
  side: "left" | "right"
  active: boolean
  /** Phase offset so the two hosts never bob in perfect sync. */
  phase: number
}

function Presenter({ color, glow, side, active, phase }: PresenterProps) {
  // Hosts sit in the lower third but drift; when speaking they rise and lean
  // inward (toward the content) to read as "presenting" rather than idling.
  const inward = side === "left" ? 26 : -26

  return (
    <motion.div
      className="absolute bottom-10"
      style={side === "left" ? { left: "6%" } : { right: "6%" }}
      // The "presenting" gesture: rise and lean toward the stage while speaking.
      animate={{
        x: active ? inward : 0,
        y: active ? -22 : 0,
      }}
      transition={{ type: "spring", stiffness: 120, damping: 18 }}
    >
      {/* Perpetual, organic float — always alive, even when not speaking. */}
      <motion.div
        className="relative"
        animate={{
          y: [0, -12, 4, -8, 0],
          x: [0, 5, -4, 3, 0],
        }}
        transition={{
          duration: 7 + phase,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: phase * 0.4,
        }}
      >
        {/* Breathing halo — soft presence, no rays. */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: 108,
            height: 108,
            background: `radial-gradient(circle, color-mix(in oklch, ${color}, transparent 78%) 0%, transparent 68%)`,
          }}
          animate={{
            scale: active ? [1, 1.28, 1] : [1, 1.12, 1],
            opacity: active ? [0.55, 0.9, 0.55] : [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: active ? 2 : 3.4,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />

        {/* Two gentle orbiting motes — a hint of energy, never permanent sparks. */}
        {[0, 1].map((i) => (
          <motion.div
            key={i}
            className="absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2"
            animate={{ rotate: i === 0 ? [0, 360] : [180, -180] }}
            transition={{
              duration: 9 + i * 4,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          >
            <span
              className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 rounded-full"
              style={{
                background: color,
                opacity: active ? 0.9 : 0.5,
                boxShadow: `0 0 8px ${color}`,
              }}
            />
          </motion.div>
        ))}

        {/* The host orb — a personable glowing sphere with a soft highlight.
            Deliberately sign-less so it can never be mistaken for a +/- charge. */}
        <motion.div
          className={`relative h-14 w-14 rounded-full ${glow}`}
          style={{
            background: `radial-gradient(circle at 38% 32%, color-mix(in oklch, ${color}, white 45%) 0%, ${color} 55%, color-mix(in oklch, ${color}, black 30%) 100%)`,
          }}
          animate={{
            scale: active ? 1.14 : 1,
            opacity: active ? 1 : 0.7,
          }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          {/* A small bright catch-light gives the orb a sense of "looking". */}
          <span
            className="absolute h-2.5 w-2.5 rounded-full"
            style={{
              top: "24%",
              left: "28%",
              background: "color-mix(in oklch, white, transparent 20%)",
              filter: "blur(0.5px)",
            }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export function NarratorIndicator({
  activeNarrator,
}: {
  activeNarrator: NarratorId | null
}) {
  return (
    <div className="pointer-events-none absolute inset-0 z-40" aria-hidden="true">
      <Presenter
        color="var(--electric-blue)"
        glow="electric-glow"
        side="left"
        phase={0}
        active={activeNarrator === "emiliano"}
      />
      <Presenter
        color="var(--electric-pink)"
        glow="pink-glow"
        side="right"
        phase={1.2}
        active={activeNarrator === "isabela"}
      />
    </div>
  )
}

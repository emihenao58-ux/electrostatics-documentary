"use client"

/**
 * Scene 5 — Conclusion (Document 1, §"Conclusion").
 * The journey converges: amber, atom and energy resolve into a single glowing
 * timeline, leaving the viewer with a sense of understanding. The energy entity
 * returns to close the narrative loop opened in the first scene.
 */

import { motion } from "motion/react"
import { ElectricEnergy } from "../electric-narrative/electric-energy"
import { ParticleField } from "../electric-narrative/particle-field"

const STEPS = [
  { label: "ámbar", color: "var(--electric-yellow)" },
  { label: "átomo", color: "var(--electric-blue)" },
  { label: "energía", color: "var(--electric-blue)" },
]

export function ConclusionScene({ cues }: { cues: Set<string> }) {
  const converge = cues.has("converge")
  const timeline = cues.has("timeline")
  const glow = cues.has("closing-glow")

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center">
      {/* Particles gather only as the story converges and glows — reinforcing
          the synthesis, not drifting idly through the whole scene. */}
      {(converge || glow) && <ParticleField density={glow ? 0.7 : 0.4} tint="mixed" />}

      {/* A closing bloom gives the "closing-glow" beat its own visual identity —
          the film's final breath of light before it fades toward the credits. */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 40%, color-mix(in oklch, var(--electric-blue), transparent 80%) 0%, transparent 65%)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: glow ? [0.5, 0.8, 0.5] : 0 }}
        transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />

      {/* Converging timeline of the whole story */}
      <div className="relative flex items-center gap-6 sm:gap-14">
        {STEPS.map((step, i) => (
          <div key={step.label} className="flex items-center gap-6 sm:gap-14">
            <motion.div
              className="flex flex-col items-center gap-3"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: timeline ? 1 : 0, y: timeline ? 0 : 24 }}
              transition={{ duration: 0.8, delay: i * 0.4 }}
            >
              <motion.div
                className={`h-16 w-16 rounded-full ${
                  step.color === "var(--electric-yellow)" ? "yellow-glow" : "electric-glow"
                }`}
                style={{
                  background: `radial-gradient(circle, ${step.color} 0%, transparent 70%)`,
                }}
                animate={{ scale: timeline ? [1, 1.08, 1] : 1 }}
                transition={{
                  duration: 2.4,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: i * 0.3,
                  ease: "easeInOut",
                }}
              />
              <span className="font-mono text-xs uppercase tracking-widest text-foreground">
                {step.label}
              </span>
            </motion.div>
            {i < STEPS.length - 1 && (
              <motion.div
                className="h-px w-8 bg-primary sm:w-16"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: timeline ? 1 : 0 }}
                transition={{ duration: 0.5, delay: i * 0.4 + 0.3 }}
              />
            )}
          </div>
        ))}
      </div>

      {/* The entity is born at the convergence, steps back while the timeline is
          read, then returns above it as the film closes — the same energy that
          opened the documentary, closing its loop. */}
      <motion.div
        className="absolute"
        initial={{ opacity: 0, scale: 0.6, y: 0 }}
        animate={{
          opacity: (converge && !timeline) || glow ? 1 : 0,
          scale: 1,
          y: glow ? -140 : 0,
        }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <ElectricEnergy x={0} y={0} size={120} filaments={6} />
      </motion.div>
    </div>
  )
}
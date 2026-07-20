"use client"

/**
 * Scene 1 — Opening Sequence (Document 1, §"Opening").
 * A single spark is born in the void, grows into the ElectricEnergy entity, and
 * the title emerges. This establishes the visual identity and the narrative
 * thread before a single concept is spoken.
 */

import { motion } from "motion/react"
import { ElectricEnergy } from "../electric-narrative/electric-energy"
import { ParticleField } from "../electric-narrative/particle-field"

export function OpeningScene({ cues }: { cues: Set<string> }) {
  const spark = cues.has("spark-birth")
  const titleBeat = cues.has("title-in")
  const gather = cues.has("energy-gather")

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {/* A single silent flash ignites the void the instant the scene mounts —
          the frame is never a blank stage waiting for something to happen. */}
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, color-mix(in oklch, var(--electric-blue), white 30%) 0%, transparent 60%)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.5, 0] }}
        transition={{ duration: 1.4, ease: "easeOut" }}
      />

      {/* A soft bloom rising behind the title band. Gives the previously inert
          "title-in" cue a real visual purpose: a second beat of light. */}
      <motion.div
        className="absolute inset-x-0 top-0 h-1/2"
        style={{
          background:
            "radial-gradient(ellipse at 50% 100%, color-mix(in oklch, var(--electric-yellow), transparent 75%) 0%, transparent 70%)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: titleBeat ? 0.8 : 0 }}
        transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Particles only stream in as the energy gathers — the one moment they
          reinforce the narrative (the birth of the entity), never idle filler. */}
      {gather && <ParticleField density={0.5} tint="mixed" />}

      {/* A breathing halo gives the entity presence in the frame beyond its
          own small core, once it is born — it grows bolder once it gathers. */}
      {spark && (
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: 260,
            height: 260,
            border:
              "1px solid color-mix(in oklch, var(--electric-blue), transparent 75%)",
          }}
          animate={{
            scale: gather ? [1, 1.7, 1] : [1, 1.3, 1],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "mirror",
            ease: "easeInOut",
          }}
        />
      )}

      {/* The birth spark expanding into the living energy entity */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        initial={{ scale: 0, opacity: 0 }}
        animate={
          spark
            ? { scale: 1, opacity: 1 }
            : { scale: 0, opacity: 0 }
        }
        transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
      >
        <ElectricEnergy x={0} y={0} size={gather ? 130 : 90} filaments={gather ? 6 : 4} />
      </motion.div>
    </div>
  )
}
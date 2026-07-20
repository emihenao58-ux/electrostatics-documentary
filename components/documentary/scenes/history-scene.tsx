"use client"

/**
 * Scene 2 — Historical Introduction (Document 1, §"Historical").
 * Ancient Greece, Thales of Miletus, and the amber experiment that named
 * electricity. When Thales is named, the Electric Narrative System draws his
 * portrait out of the dark (no empty frame); the AmberFriction demo then shows
 * friction then attraction. The Greek word 'elektron' arrives only after the
 * phenomenon has been observed.
 */

import { motion } from "motion/react"
import { AmberFriction } from "../scientific/amber-friction"
import { PortraitReveal } from "../scientific/portrait-reveal"
import { ElectricEnergy } from "../electric-narrative/electric-energy"
import { ParticleField } from "../electric-narrative/particle-field"

export function HistoryScene({ cues }: { cues: Set<string> }) {
  const thales = cues.has("reveal-thales")
  const showAmber = cues.has("show-amber")
  const rubbing = cues.has("rub-amber")
  const attracting = cues.has("attract-bits")
  const word = cues.has("greek-word")

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {/* Warm dust drifting through the torch-lit air, once the scene has a
          subject — the room feels inhabited rather than an empty gradient. */}
      {thales && <ParticleField density={0.25} tint="yellow" />}

      {/* A warm pulse of light that deepens at the moment of discovery, when
          the freshly-charged amber begins attracting the bits of straw. */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 62% 55%, color-mix(in oklch, var(--electric-yellow), transparent 82%) 0%, transparent 60%)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: attracting ? [0.6, 1, 0.6] : showAmber ? 0.4 : 0 }}
        transition={
          attracting
            ? { duration: 2.2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }
            : { duration: 1.2, ease: [0.16, 1, 0.3, 1] }
        }
      />

      {/* Portrait + experiment composed side by side once both are present, so
          the frame always carries a subject. */}
      <div className="relative flex items-center justify-center gap-4 sm:gap-16">
        {/* Thales of Miletus, revealed by the energy when he is named */}
        <motion.div
          animate={{
            scale: showAmber ? 0.72 : 1,
            x: showAmber ? -10 : 0,
            opacity: thales ? 1 : 0,
          }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <PortraitReveal
            src="/portraits/thales.png"
            alt="Grabado histórico de Tales de Mileto, filósofo griego"
            visible={thales}
            size={320}
          />
        </motion.div>

        {/* The founding amber experiment */}
        <motion.div
          className="relative flex items-center justify-center"
          animate={{ opacity: showAmber ? 1 : 0, scale: showAmber ? 1 : 0.8 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <AmberFriction visible={showAmber} rubbing={rubbing} attracting={attracting} />
        </motion.div>
      </div>

      {/* Energy entity guides the eye from the philosopher to the phenomenon */}
      <motion.div
        className="absolute left-1/2 top-1/2"
        initial={{ opacity: 0 }}
        animate={{
          opacity: thales ? 0.9 : 0,
          x: showAmber ? (word ? 240 : 150) : -60,
          y: word ? -150 : -20,
        }}
        transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <ElectricEnergy x={0} y={0} size={64} filaments={4} intensity={0.8} />
      </motion.div>
    </div>
  )
}
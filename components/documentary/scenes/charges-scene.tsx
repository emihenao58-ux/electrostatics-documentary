"use client"

/**
 * Scene 3 — Electrical Charges (Document 1, §"Charges").
 * The atom is built progressively (nucleus → electrons), charge symbols appear,
 * and attraction/repulsion are demonstrated as literal motion. Coulomb's law is
 * assembled symbol-by-symbol at the end.
 */

import { AnimatePresence, motion } from "motion/react"
import { AtomModel } from "../scientific/atom-model"
import { Charge } from "../scientific/charge"
import { ForceDemo } from "../scientific/force-visualization"
import { CoulombExplainer } from "../scientific/coulomb-explainer"
import { ParticleField } from "../electric-narrative/particle-field"

export function ChargesScene({ cues }: { cues: Set<string> }) {
  const atom = cues.has("reveal-atom")
  const nucleus = cues.has("show-nucleus")
  const electrons = cues.has("show-electrons")
  const symbols = cues.has("charge-symbols")
  const repulsion = cues.has("repulsion")
  const attraction = cues.has("attraction")
  const coulomb = cues.has("coulomb")

  const showAtom = atom && !repulsion && !attraction && !coulomb
  const showForce = (repulsion || attraction) && !coulomb

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {/* Ambient sparkle for the wonder of the hidden micro-world — fades out
          once the demonstration begins so it never competes with it. */}
      {showAtom && <ParticleField density={0.3} tint="mixed" />}

      {/* A color-coded ambient pulse reinforcing the force at play beyond the
          small demo itself: cool blue for repulsion, warm yellow for attraction. */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{
          background: attraction
            ? "radial-gradient(circle at 50% 50%, color-mix(in oklch, var(--electric-yellow), transparent 85%) 0%, transparent 65%)"
            : "radial-gradient(circle at 50% 50%, color-mix(in oklch, var(--electric-blue), transparent 85%) 0%, transparent 65%)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: showForce ? [0.4, 0.7, 0.4] : 0 }}
        transition={{ duration: 2.4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />

      <AnimatePresence mode="wait">
        {showAtom && (
          <motion.div
            key="atom"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <AtomModel showNucleus={nucleus} showElectrons={electrons} size={90} />
          </motion.div>
        )}

        {/* The two fundamental charges rise from the atom when named, giving the
            "+ / −" beat its own visible subject rather than caption text alone. */}
        {showAtom && symbols && (
          <motion.div
            key="symbols"
            className="pointer-events-none absolute inset-0 flex items-center justify-between px-[14%]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <Charge sign="+" size={72} />
            </motion.div>
            <motion.div
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            >
              <Charge sign="-" size={72} />
            </motion.div>
          </motion.div>
        )}

        {showForce && (
          <motion.div
            key="force"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.7 }}
          >
            <ForceDemo
              mode={attraction ? "attract" : "repel"}
              left={attraction ? "+" : "+"}
              right={attraction ? "-" : "+"}
            />
          </motion.div>
        )}

        {coulomb && (
          <motion.div
            key="coulomb"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <CoulombExplainer />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

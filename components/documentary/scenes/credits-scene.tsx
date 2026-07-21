"use client"

/**
 * Scene 6 — Credits (Document 1, §"Credits").
 * A calm, on-brand close. The energy entity dims to a single resting spark as
 * the credits rise, echoing the documentary's opening.
 */

import { motion } from "motion/react"
import { ElectricEnergy } from "../electric-narrative/electric-energy"

const CREDITS = [
  { role: "Una producción sobre", name: "La Electrostática" },
  { role: "Narración", name: "Emiliano e Isabela" },
  { role: "Creación", name: "Emiliano e Isabela Sierra" },
]

export function CreditsScene({ cues }: { cues: Set<string> }) {
  const show = cues.has("credits-in")
  const thanks = cues.has("credits-thanks")

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <motion.div
        className="absolute top-[22%]"
        initial={{ opacity: 0 }}
        animate={{ opacity: show ? 0.7 : 0 }}
        transition={{ duration: 1.2 }}
      >
        <ElectricEnergy x={0} y={0} size={thanks ? 60 : 80} filaments={4} intensity={0.7} />
      </motion.div>

      <motion.div
        className="flex flex-col items-center gap-6 text-center"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: show ? 1 : 0, y: show ? 0 : 40 }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
      >
        {CREDITS.map((c) => (
          <div key={c.role} className="flex flex-col gap-1">
            <span className="font-mono text-[0.7rem] uppercase tracking-[0.4em] text-muted-foreground">
              {c.role}
            </span>
            <span className="font-serif text-xl text-foreground sm:text-2xl">{c.name}</span>
          </div>
        ))}
      </motion.div>
    </div>
  )
}

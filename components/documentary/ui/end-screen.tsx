"use client"

/**
 * EndScreen — shown after the credits complete. Offers a single calm action:
 * replay the documentary from the opening spark.
 */

import { motion } from "motion/react"
import { RotateCcw } from "lucide-react"

export function EndScreen({ onReplay }: { onReplay: () => void }) {
  return (
    <motion.div
      className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-8 px-6 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <h2 className="font-serif text-3xl font-medium text-balance text-foreground sm:text-4xl">
        Gracias por observar
      </h2>
      <button
        type="button"
        onClick={onReplay}
        className="inline-flex items-center gap-3 rounded-full border border-primary/40 bg-primary/10 px-7 py-3 font-mono text-sm uppercase tracking-widest text-primary transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
      >
        <RotateCcw size={16} />
        Ver de nuevo
      </button>
    </motion.div>
  )
}

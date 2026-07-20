"use client"

/**
 * Formula — progressive formula construction (Document 2, Ch. 8).
 * A formula never appears instantly; its symbols emerge one at a time so the
 * mathematical relationship is built up in step with the narration. Permitted
 * text (formulas & symbols only, Document 1, §5).
 */

import { motion } from "motion/react"

interface FormulaProps {
  /** Ordered tokens revealed sequentially, e.g. ["F", "=", "k", ...]. */
  tokens: string[]
  /** Seconds between each token appearing. */
  stagger?: number
  className?: string
}

export function Formula({ tokens, stagger = 0.35, className }: FormulaProps) {
  return (
    <div
      className={`flex items-center gap-1 font-mono text-3xl tracking-tight text-[color:var(--foreground)] md:text-5xl ${className ?? ""}`}
    >
      {tokens.map((token, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: i * stagger, duration: 0.5, ease: "easeOut" }}
          className={
            token === "=" || token === "·" || token === "/"
              ? "text-[color:var(--muted-foreground)]"
              : "text-[color:var(--electric-yellow)] yellow-glow"
          }
        >
          {token}
        </motion.span>
      ))}
    </div>
  )
}

"use client"

/**
 * CoulombExplainer — a short, integrated micro-lesson (Document 2, Ch. 8).
 * -----------------------------------------------------------------------------
 * Coulomb's law should not merely *appear*; a small scientist guide steps
 * through it so the viewer understands what each part means:
 *   F  → la fuerza      (how strongly the charges push/pull)
 *   q₁·q₂ → las cargas  (the amount of charge on each body)
 *   r  → la distancia   (how far apart they are)
 *
 * The whole beat is a single looping ~4.5s cycle so it stays brief and always
 * synchronised, highlighting one term at a time with a matching keyword — the
 * only permitted kind of on-screen text (Document 1, §5: keywords/symbols).
 */

import { motion } from "motion/react"

/** Cycle timing shared by every highlighted term. */
const PULSE = 1.3
const CYCLE = 4.8
const STEP = 1.4

/** A term of the formula, its keyword and when it lights up within the cycle. */
interface Term {
  tokens: string[]
  keyword: string
  color: string
  delay: number
}

const TERMS: Term[] = [
  { tokens: ["F"], keyword: "fuerza", color: "var(--electric-yellow)", delay: 0 },
  { tokens: ["q₁q₂"], keyword: "cargas", color: "var(--electric-blue)", delay: STEP },
  { tokens: ["r²"], keyword: "distancia", color: "var(--electric-pink)", delay: STEP * 2 },
]

/** A neutral connective symbol that never gets highlighted. */
function Connective({ children }: { children: string }) {
  return (
    <span className="font-mono text-3xl text-[color:var(--muted-foreground)] md:text-5xl">
      {children}
    </span>
  )
}

/** One highlightable term: pulses and reveals its keyword above it in turn. */
function HighlightTerm({ term }: { term: Term }) {
  return (
    <span className="relative inline-flex flex-col items-center">
      {/* Keyword label rising above the term while it is active. */}
      <motion.span
        className="absolute -top-9 whitespace-nowrap rounded-full border px-3 py-1 font-mono text-xs uppercase tracking-[0.25em] md:text-sm"
        style={{
          color: term.color,
          borderColor: `color-mix(in oklch, ${term.color}, transparent 55%)`,
          background: `color-mix(in oklch, ${term.color}, transparent 88%)`,
        }}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: [0, 1, 1, 0], y: [8, 0, 0, 4] }}
        transition={{
          duration: PULSE,
          repeat: Number.POSITIVE_INFINITY,
          repeatDelay: CYCLE - PULSE,
          delay: term.delay,
          ease: "easeInOut",
        }}
      >
        {term.keyword}
      </motion.span>

      {/* The formula token itself, pulsing when explained. */}
      <motion.span
        className="font-mono text-3xl font-medium md:text-5xl"
        style={{ color: term.color }}
        animate={{
          scale: [1, 1.22, 1],
          textShadow: [
            `0 0 0px ${term.color}`,
            `0 0 22px ${term.color}`,
            `0 0 0px ${term.color}`,
          ],
        }}
        transition={{
          duration: PULSE,
          repeat: Number.POSITIVE_INFINITY,
          repeatDelay: CYCLE - PULSE,
          delay: term.delay,
          ease: "easeInOut",
        }}
      >
        {term.tokens.join("")}
      </motion.span>
    </span>
  )
}

/**
 * A small, friendly scientist guide. Built from simple shapes (not a complex
 * illustration): a capped head and rounded body. It bobs gently and its arm
 * sweeps toward each term in time with the cycle.
 */
function ScientistGuide() {
  return (
    <motion.div
      className="relative"
      style={{ width: 54, height: 74 }}
      animate={{ y: [0, -5, 0] }}
      transition={{ duration: 3.2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
    >
      {/* Mortarboard cap */}
      <div
        className="absolute left-1/2 top-0 h-1.5 w-11 -translate-x-1/2 rounded-sm"
        style={{ background: "var(--foreground)" }}
      />
      <div
        className="absolute left-1/2 top-[6px] h-3 w-6 -translate-x-1/2 rounded-b-md"
        style={{ background: "color-mix(in oklch, var(--foreground), transparent 15%)" }}
      />
      {/* Head */}
      <div
        className="absolute left-1/2 top-3 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full"
        style={{
          background:
            "radial-gradient(circle at 38% 34%, color-mix(in oklch, var(--electric-blue), white 55%), var(--electric-blue) 70%)",
        }}
      >
        <span className="mt-1 flex gap-1">
          <span className="h-1 w-1 rounded-full bg-[color:var(--stage-deep)]" />
          <span className="h-1 w-1 rounded-full bg-[color:var(--stage-deep)]" />
        </span>
      </div>
      {/* Body */}
      <div
        className="absolute bottom-0 left-1/2 h-9 w-9 -translate-x-1/2 rounded-t-2xl"
        style={{
          background:
            "linear-gradient(180deg, color-mix(in oklch, var(--electric-blue), black 5%), color-mix(in oklch, var(--electric-blue), black 30%))",
        }}
      />
      {/* Pointing arm that sweeps toward the highlighted terms */}
      <motion.div
        className="absolute right-0 top-9 h-1.5 w-7 origin-left rounded-full"
        style={{ background: "var(--electric-yellow)" }}
        animate={{ rotate: [-12, -40, -66, -12] }}
        transition={{
          duration: CYCLE,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          times: [0, 0.3, 0.6, 1],
        }}
      />
    </motion.div>
  )
}

export function CoulombExplainer() {
  return (
    <div className="flex flex-col items-center gap-8">
      {/* The law, with its three meaningful parts highlighted in turn. */}
      <div className="flex items-center gap-2">
        <HighlightTerm term={TERMS[0]} />
        <Connective>=</Connective>
        <span className="font-mono text-3xl text-[color:var(--electric-yellow)] md:text-5xl">
          k
        </span>
        <div className="flex flex-col items-center leading-none">
          <HighlightTerm term={TERMS[1]} />
          <span className="my-1 h-px w-16 bg-[color:var(--muted-foreground)]" />
          <HighlightTerm term={TERMS[2]} />
        </div>
      </div>

      {/* The guide presenting the law. */}
      <motion.div
        className="flex items-center gap-3"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <ScientistGuide />
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          Ley de Coulomb
        </span>
      </motion.div>
    </div>
  )
}

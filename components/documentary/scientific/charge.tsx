"use client"

/**
 * Charge — a single positive or negative electric charge.
 * Consistent visual identity across the whole documentary (Document 2, Ch. 8):
 * positive = electric yellow with "+", negative = electric blue with "−".
 */

import { motion } from "motion/react"

interface ChargeProps {
  sign: "+" | "-"
  size?: number
  className?: string
}

export function Charge({ sign, size = 56, className }: ChargeProps) {
  const positive = sign === "+"
  const color = positive ? "var(--electric-yellow)" : "var(--electric-blue)"
  const glow = positive ? "yellow-glow" : "electric-glow"

  return (
    <motion.div
      className={`relative flex items-center justify-center rounded-full ${glow} ${className ?? ""}`}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle at 40% 35%, color-mix(in oklch, ${color}, white 30%), ${color} 70%)`,
        color: "var(--stage-deep)",
      }}
      animate={{ scale: [1, 1.06, 1] }}
      transition={{ duration: 2.4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
    >
      <span
        className="font-sans font-bold leading-none"
        style={{ fontSize: size * 0.55 }}
        aria-hidden="true"
      >
        {positive ? "+" : "−"}
      </span>
    </motion.div>
  )
}

"use client"

/**
 * PortraitReveal — a historical figure revealed by the Electric Narrative
 * System (Document 1: "reveal a historical illustration when a scientist is
 * mentioned instead of leaving the background empty").
 * -----------------------------------------------------------------------------
 * The energy does not merely decorate: it *illuminates* the figure. A luminous
 * ring is traced around a period engraving, a light sweep passes across it as
 * if the current itself were drawing the portrait out of the dark, and the
 * image is graded into the electric duotone so it belongs to the film's world
 * rather than reading as an inserted photograph (Document 1, §8).
 */

import { AnimatePresence, motion } from "motion/react"

interface PortraitRevealProps {
  src: string
  /** Accessible description of the figure. */
  alt: string
  visible: boolean
  /** Diameter of the portrait medallion in px. */
  size?: number
}

export function PortraitReveal({ src, alt, visible, size = 300 }: PortraitRevealProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.figure
          className="relative m-0"
          style={{ width: size, height: size }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Soft aura behind the medallion so it sits in light, not on a wall */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                "radial-gradient(circle, color-mix(in oklch, var(--electric-blue), transparent 60%) 0%, transparent 68%)",
              filter: "blur(14px)",
            }}
          />

          {/* The engraving, graded into the electric duotone and masked to an oval */}
          <motion.div
            className="absolute inset-[6%] overflow-hidden rounded-full"
            style={{
              WebkitMaskImage: "radial-gradient(circle at 50% 45%, black 58%, transparent 78%)",
              maskImage: "radial-gradient(circle at 50% 45%, black 58%, transparent 78%)",
            }}
            initial={{ filter: "brightness(0.2)" }}
            animate={{ filter: "brightness(1)" }}
            transition={{ duration: 1.6, ease: "easeOut" }}
          >
            <img
              src={src || "/placeholder.svg"}
              alt={alt}
              className="h-full w-full object-cover"
              style={{ filter: "grayscale(1) contrast(1.08) brightness(0.95)" }}
              crossOrigin="anonymous"
            />
            {/* Duotone grade: shadows toward stage-deep, highlights toward blue */}
            <div
              className="absolute inset-0 mix-blend-color"
              style={{
                background:
                  "linear-gradient(180deg, color-mix(in oklch, var(--electric-blue), transparent 30%), color-mix(in oklch, var(--electric-yellow), transparent 55%))",
              }}
            />
            {/* Light sweep — the current drawing the figure out of the dark */}
            <motion.div
              className="absolute inset-y-0 w-1/2"
              style={{
                background:
                  "linear-gradient(90deg, transparent, color-mix(in oklch, var(--electric-blue), transparent 40%), transparent)",
              }}
              initial={{ x: "-120%" }}
              animate={{ x: "260%" }}
              transition={{ duration: 1.8, ease: "easeInOut", delay: 0.3 }}
            />
          </motion.div>

          {/* Luminous ring traced by the energy */}
          <svg className="absolute inset-0" viewBox="0 0 100 100" fill="none" aria-hidden="true">
            <motion.circle
              cx="50"
              cy="50"
              r="46"
              stroke="var(--electric-blue)"
              strokeWidth="0.8"
              className="electric-glow"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.9 }}
              transition={{ duration: 1.6, ease: "easeInOut" }}
            />
            <motion.circle
              cx="50"
              cy="50"
              r="46"
              stroke="color-mix(in oklch, var(--electric-yellow), transparent 40%)"
              strokeWidth="0.3"
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            />
          </svg>
        </motion.figure>
      )}
    </AnimatePresence>
  )
}

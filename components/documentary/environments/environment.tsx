"use client"

/**
 * Environment — procedural scene backdrop (Document 1, §11).
 * Each topic lives in its own environment, but all share one visual universe:
 * layered gradients + dynamic lighting in the electric palette. No photographs,
 * no clashing styles. Lighting breathes subtly so the frame is never static
 * (Document 1, §9 "Static State Prohibition").
 */

import { motion } from "motion/react"
import type { EnvironmentType } from "@/lib/documentary/types"
import { SetDressing } from "./set-dressing"

const BACKDROPS: Record<EnvironmentType, string> = {
  void: "radial-gradient(ellipse at 50% 40%, oklch(0.14 0.03 255) 0%, var(--stage-deep) 70%)",
  "ancient-greece":
    "linear-gradient(180deg, oklch(0.2 0.03 70) 0%, oklch(0.12 0.02 40) 55%, var(--stage-deep) 100%)",
  laboratory:
    "linear-gradient(180deg, oklch(0.18 0.03 240) 0%, oklch(0.1 0.02 250) 60%, var(--stage-deep) 100%)",
  "atomic-world":
    "radial-gradient(circle at 50% 50%, oklch(0.16 0.04 255) 0%, oklch(0.08 0.03 260) 55%, var(--stage-deep) 100%)",
  workbench:
    "linear-gradient(180deg, oklch(0.17 0.02 250) 0%, oklch(0.1 0.02 255) 65%, var(--stage-deep) 100%)",
  technological:
    "linear-gradient(180deg, oklch(0.14 0.03 250) 0%, oklch(0.16 0.05 245) 40%, var(--stage-deep) 100%)",
}

/** A warm key light for Greece, cool for science environments. */
const KEY_LIGHT: Record<EnvironmentType, string> = {
  void: "var(--electric-blue)",
  "ancient-greece": "var(--electric-yellow)",
  laboratory: "var(--electric-blue)",
  "atomic-world": "var(--electric-blue)",
  workbench: "var(--electric-yellow)",
  technological: "var(--electric-blue)",
}

export function Environment({ type }: { type: EnvironmentType }) {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Base backdrop */}
      <div className="absolute inset-0" style={{ background: BACKDROPS[type] }} />

      {/* Dynamic breathing key light */}
      <motion.div
        className="absolute -top-1/4 left-1/2 h-[80%] w-[80%] -translate-x-1/2 rounded-full"
        style={{
          background: `radial-gradient(circle, color-mix(in oklch, ${KEY_LIGHT[type]}, transparent 78%) 0%, transparent 68%)`,
        }}
        animate={{ opacity: [0.5, 0.8, 0.5], scale: [1, 1.05, 1] }}
        transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />

      {/* Ground plane for grounded environments */}
      {type !== "void" && type !== "atomic-world" && (
        <div
          className="absolute inset-x-0 bottom-0 h-1/3"
          style={{
            background:
              "linear-gradient(0deg, color-mix(in oklch, var(--stage-deep), black 30%) 0%, transparent 100%)",
          }}
        />
      )}

      {/* Contextual set dressing — columns, desks, scrolls, shelves, instruments
          — giving each environment a sense of place and depth. */}
      <SetDressing type={type} />

      {/* Atmospheric depth: a soft dark haze at the edges pushes the set pieces
          back and keeps the focal element reading as the nearest plane. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 48%, transparent 40%, color-mix(in oklch, var(--stage-deep), transparent 25%) 100%)",
        }}
      />

      {/* Faint atomic-world grid to imply scientific space */}
      {type === "technological" && (
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              "linear-gradient(var(--electric-blue) 1px, transparent 1px), linear-gradient(90deg, var(--electric-blue) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage: "radial-gradient(circle at 50% 50%, black 0%, transparent 75%)",
          }}
        />
      )}
    </div>
  )
}

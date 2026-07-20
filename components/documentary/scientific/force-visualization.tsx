"use client"

/**
 * ForceDemo — makes invisible electrostatic force visible (Document 2, Ch. 8).
 * Two charges plus directional arrows demonstrate attraction (converging) or
 * repulsion (separating) through actual motion, not text. The physical change
 * of distance IS the explanation (Document 1, §4).
 */

import { motion } from "motion/react"
import { Charge } from "./charge"

interface ForceDemoProps {
  mode: "attract" | "repel"
  /** Left charge sign. */
  left: "+" | "-"
  /** Right charge sign. */
  right: "+" | "-"
  chargeSize?: number
}

export function ForceDemo({ mode, left, right, chargeSize = 64 }: ForceDemoProps) {
  const attract = mode === "attract"
  // Charges start apart, then converge (attract) or push further out (repel).
  const spread = 110
  const target = attract ? 46 : 150

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: 420, height: chargeSize * 2 }}
    >
      <motion.div
        className="absolute top-1/2 -translate-y-1/2"
        style={{ left: "50%" }}
        animate={{ x: [-spread, -target, -spread] }}
        transition={{ duration: 3.4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      >
        <div className="relative -translate-x-1/2">
          <Charge sign={left} size={chargeSize} />
          <ForceArrow direction={attract ? "right" : "left"} />
        </div>
      </motion.div>

      <motion.div
        className="absolute top-1/2 -translate-y-1/2"
        style={{ left: "50%" }}
        animate={{ x: [spread, target, spread] }}
        transition={{ duration: 3.4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      >
        <div className="relative -translate-x-1/2">
          <Charge sign={right} size={chargeSize} />
          <ForceArrow direction={attract ? "left" : "right"} />
        </div>
      </motion.div>
    </div>
  )
}

function ForceArrow({ direction }: { direction: "left" | "right" }) {
  const isRight = direction === "right"
  return (
    <motion.svg
      width={54}
      height={20}
      viewBox="0 0 54 20"
      className="electric-glow absolute top-1/2 -translate-y-1/2"
      style={{ [isRight ? "left" : "right"]: "108%" } as React.CSSProperties}
      aria-hidden="true"
      animate={{ opacity: [0.4, 1, 0.4], x: isRight ? [0, 6, 0] : [0, -6, 0] }}
      transition={{ duration: 1.4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
    >
      <g
        stroke="var(--electric-blue)"
        strokeWidth={3}
        strokeLinecap="round"
        fill="none"
        transform={isRight ? undefined : "translate(54,0) scale(-1,1)"}
      >
        <line x1="2" y1="10" x2="42" y2="10" />
        <polyline points="34,3 44,10 34,17" />
      </g>
    </motion.svg>
  )
}

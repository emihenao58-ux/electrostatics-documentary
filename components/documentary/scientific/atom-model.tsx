"use client"

/**
 * AtomModel — a simplified, educational atom (Document 2, Ch. 8).
 * Built progressively: the nucleus and electron shells are revealed on cue so
 * the viewer observes the atom being constructed rather than appearing whole.
 * Conceptual clarity over physical exactness.
 */

import { AnimatePresence, motion } from "motion/react"

interface AtomModelProps {
  showNucleus?: boolean
  showElectrons?: boolean
  size?: number
}

const ORBITS = [
  { radius: 1, electrons: 2, duration: 6, tilt: 0 },
  { radius: 1.55, electrons: 3, duration: 9, tilt: 60 },
  { radius: 2.1, electrons: 3, duration: 12, tilt: -60 },
]

export function AtomModel({
  showNucleus = true,
  showElectrons = true,
  size = 120,
}: AtomModelProps) {
  return (
    <div
      className="relative"
      style={{ width: size * 4.6, height: size * 4.6 }}
      aria-hidden="true"
    >
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Nucleus: protons (+) clustered */}
        <AnimatePresence>
          {showNucleus && (
            <motion.div
              className="yellow-glow relative z-10 flex items-center justify-center rounded-full"
              style={{
                width: size,
                height: size,
                background:
                  "radial-gradient(circle at 40% 35%, color-mix(in oklch, var(--electric-yellow), white 25%), var(--electric-yellow) 60%, color-mix(in oklch, var(--electric-yellow), var(--electric-blue) 40%) 100%)",
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 140, damping: 12 }}
            >
              <motion.span
                className="font-sans font-bold text-[color:var(--stage-deep)]"
                style={{ fontSize: size * 0.34 }}
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                +
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Electron shells */}
        <AnimatePresence>
          {showElectrons &&
            ORBITS.map((orbit, i) => {
              const diameter = size * (1.6 * orbit.radius + 0.6)
              return (
                <motion.div
                  key={i}
                  className="absolute rounded-full border"
                  style={{
                    width: diameter,
                    height: diameter,
                    borderColor:
                      "color-mix(in oklch, var(--electric-blue), transparent 55%)",
                    rotate: orbit.tilt,
                  }}
                  initial={{ opacity: 0, scale: 0.4 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.4 }}
                  transition={{ delay: 0.15 * i, duration: 0.6 }}
                >
                  <motion.div
                    className="absolute inset-0"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: orbit.duration,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                  >
                    {Array.from({ length: orbit.electrons }).map((_, e) => {
                      const angle = (360 / orbit.electrons) * e
                      return (
                        <span
                          key={e}
                          className="electric-glow absolute flex items-center justify-center rounded-full font-bold"
                          style={{
                            width: size * 0.28,
                            height: size * 0.28,
                            top: "50%",
                            left: "50%",
                            fontSize: size * 0.16,
                            color: "var(--stage-deep)",
                            background:
                              "radial-gradient(circle at 40% 35%, color-mix(in oklch, var(--electric-blue), white 30%), var(--electric-blue) 70%)",
                            transform: `rotate(${angle}deg) translateX(${diameter / 2}px) rotate(-${angle}deg) translate(-50%, -50%)`,
                          }}
                        >
                          −
                        </span>
                      )
                    })}
                  </motion.div>
                </motion.div>
              )
            })}
        </AnimatePresence>
      </div>
    </div>
  )
}

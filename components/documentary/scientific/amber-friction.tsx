"use client"

/**
 * AmberFriction — the founding experiment (Document 1, §4 "Amber Friction").
 * -----------------------------------------------------------------------------
 * Amber is rubbed and, little by little, an electric charge is born, travels
 * across its surface and accumulates — then the charged amber attracts small
 * bits of straw, the phenomenon that gave electricity its name.
 *
 * The friction is now shown as LIVING, ACCUMULATING energy rather than a few
 * blinking dots:
 *   - a charge layer that grows gradually from nothing as the amber is rubbed;
 *   - luminous motes that stream slowly across the amber's surface and sink
 *     into the stone, reading as charge being stored;
 *   - a glow that intensifies over time.
 * Observation always precedes any verbal explanation.
 */

import { AnimatePresence, motion } from "motion/react"
import { useMemo } from "react"

interface AmberFrictionProps {
  visible?: boolean
  rubbing?: boolean
  attracting?: boolean
}

const AMBER_W = 130
const AMBER_H = 150

export function AmberFriction({
  visible = true,
  rubbing = false,
  attracting = false,
}: AmberFrictionProps) {
  const bits = Array.from({ length: 7 })
  const charging = rubbing || attracting

  // Motes that travel slowly across the amber surface while it is being rubbed,
  // then sink inward — the visual of charge gathering and being stored.
  const surfaceMotes = useMemo(
    () =>
      Array.from({ length: 9 }).map((_, i) => ({
        startX: -AMBER_W * 0.32 + Math.random() * AMBER_W * 0.64,
        drift: (Math.random() - 0.5) * 26,
        size: 2.5 + Math.random() * 2.5,
        duration: 2.6 + Math.random() * 1.8,
        delay: i * 0.42,
      })),
    [],
  )

  return (
    <div className="relative" style={{ width: 320, height: 260 }} aria-hidden="true">
      <AnimatePresence>
        {visible && (
          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 14 }}
          >
            {/* Amber stone. Its glow intensifies gradually as it is charged. */}
            <motion.div
              className="yellow-glow relative rounded-[46%_54%_52%_48%/58%_46%_54%_42%]"
              style={{
                width: AMBER_W,
                height: AMBER_H,
                background:
                  "radial-gradient(circle at 38% 32%, color-mix(in oklch, var(--electric-yellow), white 35%), var(--electric-yellow) 45%, oklch(0.55 0.14 60) 100%)",
              }}
              animate={
                charging
                  ? {
                      // A slow build-up (7s) from a faint glow to a strong,
                      // stored charge — then a gentle living pulse.
                      boxShadow: [
                        "0 0 12px color-mix(in oklch, var(--electric-yellow), transparent 40%)",
                        "0 0 30px color-mix(in oklch, var(--electric-yellow), transparent 20%)",
                        "0 0 52px var(--electric-yellow)",
                      ],
                    }
                  : { boxShadow: "0 0 12px color-mix(in oklch, var(--electric-yellow), transparent 55%)" }
              }
              transition={{ duration: charging ? 7 : 1, ease: "easeInOut" }}
            >
              {/* Accumulating charge layer — grows from nothing over the rub,
                  literally showing electricity being stored in the amber. */}
              <AnimatePresence>
                {charging && (
                  <motion.div
                    className="absolute inset-0 rounded-[inherit]"
                    style={{
                      background:
                        "radial-gradient(circle at 50% 55%, color-mix(in oklch, var(--electric-blue), transparent 30%) 0%, transparent 65%)",
                      mixBlendMode: "screen",
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: attracting ? 0.85 : [0, 0.35, 0.7] }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: attracting ? 1 : 7, ease: "easeOut" }}
                  />
                )}
              </AnimatePresence>

              {/* Surface energy: motes streaming across the stone and sinking in. */}
              <AnimatePresence>
                {rubbing &&
                  !attracting &&
                  surfaceMotes.map((m, i) => (
                    <motion.span
                      key={i}
                      className="electric-glow absolute rounded-full"
                      style={{
                        width: m.size,
                        height: m.size,
                        left: "50%",
                        top: "12%",
                        background: "var(--electric-blue)",
                      }}
                      initial={{ opacity: 0, x: m.startX, y: -6, scale: 0.6 }}
                      animate={{
                        // Travel down and across the surface, then sink inward.
                        opacity: [0, 0.9, 0.9, 0],
                        x: [m.startX, m.startX + m.drift, m.startX + m.drift * 0.4],
                        y: [-6, AMBER_H * 0.4, AMBER_H * 0.62],
                        scale: [0.6, 1, 0.3],
                      }}
                      transition={{
                        duration: m.duration,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                        delay: m.delay,
                      }}
                    />
                  ))}
              </AnimatePresence>
            </motion.div>

            {/* Rubbing cloth — a slow, deliberate back-and-forth stroke. */}
            <AnimatePresence>
              {rubbing && !attracting && (
                <motion.div
                  className="absolute -top-7 left-1/2 h-12 w-28 -translate-x-1/2 rounded-xl"
                  style={{
                    background:
                      "linear-gradient(180deg, oklch(0.5 0.03 250), oklch(0.38 0.03 250))",
                    boxShadow: "0 6px 18px rgba(0,0,0,0.45)",
                  }}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0, x: ["-32%", "-68%", "-32%"] }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{
                    x: { duration: 1.6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
                    opacity: { duration: 0.5 },
                    y: { duration: 0.5 },
                  }}
                />
              )}
            </AnimatePresence>

            {/* Bits of straw attracted toward the charged amber. */}
            {bits.map((_, i) => {
              const angle = (360 / bits.length) * i
              const radius = 130
              const restX = Math.cos((angle * Math.PI) / 180) * radius
              const restY = Math.sin((angle * Math.PI) / 180) * radius + 40
              return (
                <motion.span
                  key={i}
                  className="absolute left-1/2 top-1/2 h-1 w-5 rounded-full"
                  style={{ background: "oklch(0.8 0.1 95)", originX: 0.5 }}
                  animate={{
                    x: attracting ? [restX, restX * 0.12] : restX,
                    y: attracting ? [restY, restY * 0.12] : restY,
                    rotate: angle,
                    opacity: attracting ? 1 : 0.5,
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: attracting ? Number.POSITIVE_INFINITY : 0,
                    repeatType: "mirror",
                    ease: "easeInOut",
                    delay: i * 0.05,
                  }}
                />
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

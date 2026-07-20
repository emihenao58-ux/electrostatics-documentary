"use client"

/**
 * ChargeTransfer — shared visual vocabulary for "how a body becomes charged"
 * (Document 1, §"Methods"). Three small, reusable pieces used by the
 * Methods scene so friction, contact and induction each read as an
 * observable event rather than a sudden state change:
 *   - SparkCluster: static-charge sparks popping near a surface (friction) —
 *     the same visual idiom already established by AmberFriction.
 *   - TransferFlow: a single charge visibly travelling from body to body
 *     (contact).
 *   - FieldArcs: curved field lines linking two bodies that never touch
 *     (induction) — the invisible force made visible, same philosophy as
 *     ForceDemo (Document 2, Ch. 8).
 */

import { AnimatePresence, motion } from "motion/react"
import { useMemo } from "react"

/** A handful of glowing sparks popping in and out near a contact surface. */
export function SparkCluster({
    active,
    color = "blue",
}: {
    active: boolean
    color?: "blue" | "yellow"
}) {
    const tint = color === "yellow" ? "var(--electric-yellow)" : "var(--electric-blue)"
    const sparks = useMemo(
        () =>
            Array.from({ length: 5 }).map((_, i) => ({
                left: 15 + i * 18,
                top: 20 + ((i * 37) % 60),
                delay: i * 0.14,
            })),
        [],
    )

    return (
        <AnimatePresence>
            {active &&
                sparks.map((s, i) => (
                    <motion.span
                        key={i}
                        className="electric-glow absolute h-1.5 w-1.5 rounded-full"
                        style={{ left: `${s.left}%`, top: `${s.top}%`, background: tint }}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: [0, 1, 0], scale: [0, 1.4, 0] }}
                        exit={{ opacity: 0, scale: 0 }}
                        transition={{
                            duration: 0.8,
                            repeat: Number.POSITIVE_INFINITY,
                            delay: s.delay,
                        }}
                    />
                ))}
        </AnimatePresence>
    )
}

/** A single charge visibly travelling the distance between two bodies. */
export function TransferFlow({
    active,
    distance,
    sign = "-",
}: {
    active: boolean
    distance: number
    sign?: "+" | "-"
}) {
    const tint = sign === "+" ? "var(--electric-yellow)" : "var(--electric-blue)"
    const half = distance / 2
    return (
        <AnimatePresence>
            {active && (
                <motion.span
                    className="electric-glow pointer-events-none absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full"
                    style={{ background: tint }}
                    initial={{ x: -half, opacity: 0 }}
                    animate={{ x: [-half, half], opacity: [0, 1, 1, 0] }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.1, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                    aria-hidden="true"
                />
            )}
        </AnimatePresence>
    )
}

/** Curved field lines linking two bodies that never touch (induction). */
export function FieldArcs({ active, width }: { active: boolean; width: number }) {
    const arcs = [-32, 0, 32]
    return (
        <AnimatePresence>
            {active && (
                <motion.svg
                    width={width}
                    height={140}
                    viewBox={`0 0 ${width} 140`}
                    className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.85 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6 }}
                    aria-hidden="true"
                >
                    {arcs.map((bow, i) => (
                        <motion.path
                            key={i}
                            d={`M 8 ${70 - bow} Q ${width / 2} ${70 - bow * 2.4} ${width - 8} ${70 - bow}`}
                            fill="none"
                            stroke="var(--electric-blue)"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeDasharray="6 10"
                            className="electric-glow"
                            animate={{ strokeDashoffset: [0, -32] }}
                            transition={{
                                duration: 1.4,
                                repeat: Number.POSITIVE_INFINITY,
                                ease: "linear",
                                delay: i * 0.1,
                            }}
                        />
                    ))}
                </motion.svg>
            )}
        </AnimatePresence>
    )
}
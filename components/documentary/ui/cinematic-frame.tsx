"use client"

/**
 * CinematicFrame — the persistent film frame around the whole viewport
 * (Document 1, §9 "Static State Prohibition" — the viewport is never a
 * webpage). A purely decorative, non-interactive top layer: letterbox bars,
 * a breathing vignette and a faint animated film grain.
 * -----------------------------------------------------------------------------
 * It takes no props and reads no engine state, so it can never conflict with
 * the DocumentaryController or the Stage's contract — it simply sits above
 * everything the shell renders, in every status (idle, loading, playing,
 * ended), giving the whole experience a consistent cinematic edge.
 */

import { motion } from "motion/react"

export function CinematicFrame() {
    return (
        <div
            className="pointer-events-none fixed inset-0 z-[100] overflow-hidden"
            aria-hidden="true"
        >
            {/* Breathing vignette — reuses the existing .cinematic-vignette utility,
          which already ships the (previously unused) vignette-breathe keyframe. */}
            <div className="absolute inset-0 cinematic-vignette" />

            {/* Faint animated film grain */}
            <div
                className="film-grain absolute inset-0"
                style={{ opacity: 0.05, mixBlendMode: "overlay" }}
            />

            {/* Letterbox bars — on-brand dark rather than pure black, with a hairline
          of electric-blue at the inner edge so they read as designed, not cropped. */}
            <motion.div
                className="absolute inset-x-0 top-0"
                style={{ background: "var(--stage-deep)" }}
                initial={{ height: 0 }}
                animate={{ height: "4%" }}
                transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
            >
                <div
                    className="absolute inset-x-0 bottom-0 h-px"
                    style={{
                        background:
                            "color-mix(in oklch, var(--electric-blue), transparent 70%)",
                    }}
                />
            </motion.div>
            <motion.div
                className="absolute inset-x-0 bottom-0"
                style={{ background: "var(--stage-deep)" }}
                initial={{ height: 0 }}
                animate={{ height: "4%" }}
                transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
            >
                <div
                    className="absolute inset-x-0 top-0 h-px"
                    style={{
                        background:
                            "color-mix(in oklch, var(--electric-blue), transparent 70%)",
                    }}
                />
            </motion.div>
        </div>
    )
}
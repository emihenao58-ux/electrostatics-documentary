"use client"

/**
 * Scene UI primitives (Document 1, §5 "Minimal on-screen text").
 * -----------------------------------------------------------------------------
 * These are the ONLY components allowed to render text over the film. They keep
 * typography restrained: a serif display face for concept/scientist titles and
 * a mono face for scientific captions (formulas, symbols, dates). Nothing here
 * ever renders paragraphs — meaning is carried by narration + animation.
 */

import { AnimatePresence, motion } from "motion/react"
import type { NarratorId } from "@/lib/documentary/types"

/** Large cinematic scene title (concept, scientist or experiment name). */
export function SceneTitle({
  title,
  subtitle,
  show,
}: {
  title: string
  subtitle?: string
  show: boolean
}) {
  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          className="pointer-events-none absolute inset-x-0 top-[18%] flex flex-col items-center px-6 text-center"
          initial={{ opacity: 0, y: 24, filter: "blur(12px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -16, filter: "blur(8px)" }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="font-serif text-4xl font-medium tracking-tight text-balance text-foreground drop-shadow-[0_0_28px_rgba(80,180,255,0.35)] sm:text-6xl md:text-7xl">
            {title}
          </h2>
          {subtitle ? (
            <p className="mt-4 font-mono text-xs uppercase tracking-[0.5em] text-primary sm:text-sm">
              {subtitle}
            </p>
          ) : null}
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

/**
 * Caption / subtitle pinned near the lower third.
 * -----------------------------------------------------------------------------
 * This is the documentary's subtitle surface. It already tracks the timeline
 * via `caption` (derived from the active narration cue), so it is READY for the
 * recorded narration: when the team drops the mp3s named in `scenes.ts` and
 * fills each cue's `caption` with its spoken line, the subtitles will follow
 * every narration segment automatically — no code change required.
 *
 * It renders both short scientific labels (formulas, symbols, dates) and full
 * spoken subtitle lines: text wraps and balances, and a small accent bar is
 * tinted by the current speaker (Emiliano = blue, Isabela = pink) so viewers
 * can tell which host is talking.
 */
export function Caption({
  caption,
  speaker = null,
}: {
  caption: string | null
  speaker?: NarratorId | null
}) {
  const accent =
    speaker === "isabela"
      ? "var(--electric-pink)"
      : speaker === "emiliano"
        ? "var(--electric-blue)"
        : "color-mix(in oklch, var(--foreground), transparent 70%)"

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-[10%] flex justify-center px-6">
      <AnimatePresence mode="wait">
        {caption ? (
          <motion.p
            key={caption}
            className="flex max-w-[42ch] items-center gap-3 rounded-2xl border border-border/60 bg-background/50 px-5 py-2.5 text-center font-mono text-sm leading-relaxed tracking-wide text-foreground text-balance backdrop-blur-md sm:text-base"
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <span
              aria-hidden="true"
              className="h-4 w-1 shrink-0 rounded-full"
              style={{ background: accent, boxShadow: `0 0 8px ${accent}` }}
            />
            {caption}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

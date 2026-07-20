/**
 * config.ts
 * -----------------------------------------------------------------------------
 * Single source of truth for engine-wide tuning values. Kept separate from any
 * system logic to honour Separation of Concerns (Document 2, Ch. 16). Changing
 * pacing, palette or audio behaviour never requires touching a manager.
 */

/** Canonical visual identity (Document 1, §8). Mirrors CSS custom properties. */
export const PALETTE = {
  electricBlue: "#2b9cff",
  electricYellow: "#ffd21f",
  white: "#f5f9ff",
  darkGray: "#161b22",
  black: "#05070d",
} as const

/** Global timing constants (seconds unless noted). */
export const TIMING = {
  /** Duration of a scene-to-scene cinematic transition. */
  transition: 1.4,
  /** Point (0..1) within a transition when the scene swap happens. */
  transitionSwapPoint: 0.5,
  /** Opening title hold before the documentary body begins. */
  openingHold: 3,
} as const

/**
 * Phase boundaries as fractions of scene progress. Every scene walks the same
 * learning cycle (Document 2, Ch. 6): observe → develop → reinforce → conclude.
 */
export const PHASE_BOUNDARIES = {
  introduction: 0.16,
  development: 0.62,
  reinforcement: 0.9,
  // remainder is "conclusion"
} as const

/** Audio mixing behaviour (Document 1, §14 / Document 2, Ch. 11). */
export const AUDIO = {
  /** Ambient music level when no narration is playing. */
  musicBase: 0.35,
  /** Ambient music level while narration plays (audio ducking). */
  musicDucked: 0.12,
  /** Narration playback level (always the dominant layer). */
  narration: 1,
  /** Seconds to smoothly ramp music volume during ducking. */
  duckRamp: 0.6,
} as const

/**
 * Performance quality tiers (Document 2, Ch. 14). The Performance Manager
 * downgrades the tier if frame rate drops, scaling particle budgets so the
 * documentary stays fluid without the viewer ever noticing.
 */
export const QUALITY_TIERS = {
  high: { particles: 1, label: "high" },
  medium: { particles: 0.6, label: "medium" },
  low: { particles: 0.3, label: "low" },
} as const

export type QualityTierName = keyof typeof QUALITY_TIERS

/** Frame-rate thresholds that trigger a quality downgrade / upgrade. */
export const PERFORMANCE = {
  downgradeBelowFps: 45,
  upgradeAboveFps: 57,
  /** How many seconds of sustained low FPS before downgrading. */
  sustainSeconds: 2,
} as const

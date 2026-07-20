/**
 * PerformanceManager (Document 2, Ch. 5 & 14)
 * -----------------------------------------------------------------------------
 * Monitors frame rate and derives a quality tier that scales visual budgets
 * (particle counts, effect density). All optimisation is invisible to the
 * viewer — the goal is uninterrupted, fluid playback.
 */

import {
  PERFORMANCE,
  QUALITY_TIERS,
  type QualityTierName,
} from "../config"

export class PerformanceManager {
  private fps = 60
  private tier: QualityTierName = "high"
  private lowFor = 0
  private highFor = 0

  getFps(): number {
    return Math.round(this.fps)
  }

  getTier(): QualityTierName {
    return this.tier
  }

  /** Multiplier (0..1) applied to particle / effect budgets. */
  getParticleScale(): number {
    return QUALITY_TIERS[this.tier].particles
  }

  /** Feed one frame delta (ms). Returns true if the tier changed. */
  sample(deltaMs: number): boolean {
    if (deltaMs <= 0) return false
    // Exponential moving average keeps the reading stable.
    const instantaneous = 1000 / deltaMs
    this.fps = this.fps * 0.9 + instantaneous * 0.1

    const dt = deltaMs / 1000
    const previous = this.tier

    if (this.fps < PERFORMANCE.downgradeBelowFps) {
      this.lowFor += dt
      this.highFor = 0
    } else if (this.fps > PERFORMANCE.upgradeAboveFps) {
      this.highFor += dt
      this.lowFor = 0
    } else {
      this.lowFor = 0
      this.highFor = 0
    }

    if (this.lowFor >= PERFORMANCE.sustainSeconds) {
      this.tier = this.tier === "high" ? "medium" : "low"
      this.lowFor = 0
    } else if (this.highFor >= PERFORMANCE.sustainSeconds) {
      this.tier = this.tier === "low" ? "medium" : "high"
      this.highFor = 0
    }

    return previous !== this.tier
  }

  reset(): void {
    this.fps = 60
    this.tier = "high"
    this.lowFor = 0
    this.highFor = 0
  }
}

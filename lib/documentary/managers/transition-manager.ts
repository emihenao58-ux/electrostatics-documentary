/**
 * TransitionManager (Document 2, Ch. 5 & dedicated transition spec)
 * -----------------------------------------------------------------------------
 * Preserves narrative continuity between scenes. A transition is not a flashy
 * effect but a natural visual evolution from one concept to the next
 * (Document 1, §15). This manager tracks transition progress and signals the
 * midpoint "swap" moment when the outgoing scene should be replaced.
 */

import { TIMING } from "../config"
import type { TransitionType } from "../types"

export class TransitionManager {
  private active = false
  private type: TransitionType = "fade-black"
  private elapsed = 0
  private swapped = false

  isActive(): boolean {
    return this.active
  }

  getType(): TransitionType {
    return this.type
  }

  getProgress(): number {
    return Math.min(1, this.elapsed / TIMING.transition)
  }

  begin(type: TransitionType) {
    this.active = true
    this.type = type
    this.elapsed = 0
    this.swapped = false
  }

  /**
   * Advance the transition. Returns "swap" exactly once, at the midpoint, so
   * the controller can exchange scenes behind the cover of the transition;
   * returns "complete" when the transition finishes; otherwise null.
   */
  tick(dt: number): "swap" | "complete" | null {
    if (!this.active) return null
    this.elapsed += dt
    const progress = this.getProgress()

    if (!this.swapped && progress >= TIMING.transitionSwapPoint) {
      this.swapped = true
      return "swap"
    }
    if (progress >= 1) {
      this.active = false
      return "complete"
    }
    return null
  }

  reset() {
    this.active = false
    this.elapsed = 0
    this.swapped = false
  }
}

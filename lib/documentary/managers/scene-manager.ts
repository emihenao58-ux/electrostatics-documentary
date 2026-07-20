/**
 * SceneManager (Document 2, Ch. 5 & 6)
 * -----------------------------------------------------------------------------
 * Owns the lifecycle and sequencing of scenes. Exactly one scene is active at a
 * time. It tracks elapsed scene time, derives the current learning phase and
 * reports scene completion — but never animates or renders anything itself.
 */

import { PHASE_BOUNDARIES } from "../config"
import type { SceneConfig, ScenePhase } from "../types"

export class SceneManager {
  private scenes: SceneConfig[]
  private index = 0
  private elapsed = 0

  constructor(scenes: SceneConfig[]) {
    this.scenes = scenes
  }

  getScenes(): SceneConfig[] {
    return this.scenes
  }

  getIndex(): number {
    return this.index
  }

  getCurrent(): SceneConfig {
    return this.scenes[this.index]
  }

  getNext(): SceneConfig | null {
    return this.scenes[this.index + 1] ?? null
  }

  isLast(): boolean {
    return this.index >= this.scenes.length - 1
  }

  getElapsed(): number {
    return this.elapsed
  }

  /** Progress through the current scene, clamped 0..1. */
  getProgress(): number {
    const dur = this.getCurrent().duration || 1
    return Math.min(1, this.elapsed / dur)
  }

  /** Advance the scene clock by dt seconds. */
  tick(dt: number) {
    this.elapsed += dt
  }

  /** Activate a scene by index and reset its internal clock. */
  activate(index: number) {
    this.index = Math.max(0, Math.min(index, this.scenes.length - 1))
    this.elapsed = 0
  }

  advance() {
    if (!this.isLast()) this.activate(this.index + 1)
  }

  /**
   * Derive the learning phase from progress (Document 2, Ch. 6). Scene visuals
   * use the phase to sequence their reveal / reinforcement behaviour.
   */
  getPhase(): ScenePhase {
    const p = this.getProgress()
    if (p >= 1) return "transition"
    if (p < PHASE_BOUNDARIES.introduction) return "introduction"
    if (p < PHASE_BOUNDARIES.development) return "development"
    if (p < PHASE_BOUNDARIES.reinforcement) return "reinforcement"
    return "conclusion"
  }

  reset() {
    this.index = 0
    this.elapsed = 0
  }
}

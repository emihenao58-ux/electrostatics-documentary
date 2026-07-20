/**
 * AnimationManager (Document 2, Ch. 5 & 9)
 * -----------------------------------------------------------------------------
 * Translates the scene timeline into discrete "active cue" state. Concrete
 * movement is executed declaratively by React + Motion components; this manager
 * decides *when* each educational beat becomes visible so that animation can
 * anticipate narration (observe-before-explain, Document 2, Ch. 4 & 9).
 *
 * It also resolves the caption that should currently be shown, keeping on-screen
 * text minimal (Document 1, §5).
 */

import type { NarrationCue, SceneConfig } from "../types"

export class AnimationManager {
  /** Resolve the [start, end) window of a cue, defaulting end to next cue. */
  private windowFor(
    cues: NarrationCue[],
    i: number,
    sceneDuration: number,
  ): [number, number] {
    const cue = cues[i]
    const start = cue.start
    const end = cue.end ?? cues[i + 1]?.start ?? sceneDuration
    return [start, end]
  }

  /**
   * Cue ids active at the given scene time. A cue stays "active" from its start
   * onward once revealed (reveals are cumulative — the documentary constructs
   * knowledge progressively rather than erasing it).
   */
  getActiveCues(scene: SceneConfig, elapsed: number): string[] {
    return scene.cues.filter((c) => elapsed >= c.start).map((c) => c.id)
  }

  /** The caption for the cue whose window contains the current time. */
  getCaption(scene: SceneConfig, elapsed: number): string | null {
    for (let i = scene.cues.length - 1; i >= 0; i--) {
      const [start, end] = this.windowFor(scene.cues, i, scene.duration)
      if (elapsed >= start && elapsed < end) {
        return scene.cues[i].caption ?? null
      }
    }
    return null
  }
}

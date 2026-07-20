/**
 * CameraManager (Document 2, Ch. 5 & 10)
 * -----------------------------------------------------------------------------
 * The invisible cinematic guide. It converts a scene's camera keyframes into a
 * form the stage can animate, and can also sample an interpolated transform at
 * any time. Movement is always subtle and purposeful — it exists to guide
 * attention toward educational content, never to show off.
 */

import type { CameraKeyframe, CameraTransform, SceneConfig } from "../types"

export class CameraManager {
  /**
   * Convert keyframes into Motion-friendly keyframe arrays + normalised times.
   * The stage feeds these directly into a single tween so the camera animates
   * smoothly for the scene's whole duration without per-frame React work.
   */
  toMotionKeyframes(scene: SceneConfig) {
    const frames = this.normalise(scene)
    const duration = scene.duration || 1
    return {
      x: frames.map((f) => `${f.x}%`),
      y: frames.map((f) => `${f.y}%`),
      scale: frames.map((f) => f.scale),
      times: frames.map((f) => Math.min(1, f.time / duration)),
    }
  }

  /** Interpolate a transform at an arbitrary scene time. */
  sample(scene: SceneConfig, elapsed: number): CameraTransform {
    const frames = this.normalise(scene)
    if (frames.length === 1) {
      return { x: frames[0].x, y: frames[0].y, scale: frames[0].scale }
    }
    for (let i = 0; i < frames.length - 1; i++) {
      const a = frames[i]
      const b = frames[i + 1]
      if (elapsed >= a.time && elapsed <= b.time) {
        const span = b.time - a.time || 1
        const t = this.easeInOut((elapsed - a.time) / span)
        return {
          x: a.x + (b.x - a.x) * t,
          y: a.y + (b.y - a.y) * t,
          scale: a.scale + (b.scale - a.scale) * t,
        }
      }
    }
    const last = frames[frames.length - 1]
    return { x: last.x, y: last.y, scale: last.scale }
  }

  /** Guarantee at least a neutral keyframe so scenes never break. */
  private normalise(scene: SceneConfig): CameraKeyframe[] {
    if (scene.camera && scene.camera.length > 0) return scene.camera
    return [{ time: 0, x: 0, y: 0, scale: 1 }]
  }

  private easeInOut(t: number): number {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
  }
}

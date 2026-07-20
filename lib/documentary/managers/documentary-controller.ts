/**
 * DocumentaryController (Document 2, Ch. 5 "Documentary Controller")
 * -----------------------------------------------------------------------------
 * The orchestrator. It owns the global timeline and coordinates every manager,
 * but never renders or animates anything itself. It runs a single rAF loop and
 * publishes an immutable snapshot to React *only when a discrete value changes*
 * (scene, phase, active cues, transition, caption, status). This keeps the
 * React tree from re-rendering every frame — continuous motion is handled
 * declaratively by Motion components downstream.
 *
 * Execution mirrors the Documentary Flow (Document 2, Ch. 4):
 *   idle → loading → playing (scene sequence with cinematic transitions) → ended
 */

import type {
  DocumentarySnapshot,
  ResourceDescriptor,
  SceneConfig,
} from "../types"
import { AnimationManager } from "./animation-manager"
import { AudioManager } from "./audio-manager"
import { CameraManager } from "./camera-manager"
import { PerformanceManager } from "./performance-manager"
import { ResourceManager } from "./resource-manager"
import { SceneManager } from "./scene-manager"
import { TransitionManager } from "./transition-manager"

type Listener = (snapshot: DocumentarySnapshot) => void

export interface ControllerOptions {
  scenes: SceneConfig[]
  musicSrc?: string
  /** Extra assets to preload beyond narration tracks. */
  resources?: ResourceDescriptor[]
}

export class DocumentaryController {
  readonly scene: SceneManager
  readonly camera: CameraManager
  readonly animation: AnimationManager
  readonly audio: AudioManager
  readonly transition: TransitionManager
  readonly resources: ResourceManager
  readonly performance: PerformanceManager

  private listeners = new Set<Listener>()
  private snapshot: DocumentarySnapshot
  private options: ControllerOptions

  private rafId = 0
  private lastTime = 0
  private running = false
  private status: DocumentarySnapshot["status"] = "idle"
  private captionsEnabled = false
  private muted = false

  constructor(options: ControllerOptions) {
    this.options = options
    this.scene = new SceneManager(options.scenes)
    this.camera = new CameraManager()
    this.animation = new AnimationManager()
    this.audio = new AudioManager()
    this.transition = new TransitionManager()
    this.resources = new ResourceManager()
    this.performance = new PerformanceManager()
    if (options.musicSrc) this.audio.setMusicTrack(options.musicSrc)
    this.snapshot = this.buildSnapshot()
  }

  // ---- Subscription ---------------------------------------------------------

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener)
    listener(this.snapshot)
    return () => this.listeners.delete(listener)
  }

  getSnapshot(): DocumentarySnapshot {
    return this.snapshot
  }

  // ---- Public transport controls (used internally / at boundaries) ---------

  /** Kick off preloading then playback. Requires a user gesture for audio. */
  async start() {
    if (this.status !== "idle") return
    this.setStatus("loading")

    const narrationResources: ResourceDescriptor[] = this.options.scenes.flatMap(
      (scene) =>
        scene.narration?.segments.map((segment, index) => ({
          id: `narration-${scene.id}-${index}`,
          kind: "audio" as const,
          src: segment.src,
        })) ?? [],
    )
    await this.resources.preload(
      [...narrationResources, ...(this.options.resources ?? [])],
      (progress) => this.patch({ loadProgress: progress }),
    )

    this.audio.startMusic()
    this.scene.activate(0)
    this.audio.playNarration(this.scene.getCurrent().narration)
    this.setStatus("playing")
    this.beginLoop()
  }

  pause() {
    if (this.status !== "playing") return
    this.running = false
    cancelAnimationFrame(this.rafId)
    this.audio.pause()
    this.setStatus("paused")
  }

  resume() {
    if (this.status !== "paused") return
    this.audio.resume()
    this.setStatus("playing")
    this.beginLoop()
  }

  /** Restart from the opening scene (used by the end-of-film replay). */
  restart() {
    this.running = false
    cancelAnimationFrame(this.rafId)
    this.transition.reset()
    this.scene.activate(0)
    this.audio.playNarration(this.scene.getCurrent().narration)
    this.setStatus("playing")
    this.beginLoop()
  }

  setCaptionsEnabled(enabled: boolean) {
    this.captionsEnabled = enabled
    this.patch({ captionsEnabled: enabled })
  }

  setMuted(muted: boolean) {
    this.muted = muted
    this.audio.setMuted(muted)
    this.patch({ muted })
  }

  dispose() {
    this.running = false
    cancelAnimationFrame(this.rafId)
    this.audio.dispose()
    this.listeners.clear()
  }

  // ---- Core loop ------------------------------------------------------------

  private beginLoop() {
    this.running = true
    this.lastTime = performance.now()
    const loop = (now: number) => {
      if (!this.running) return
      const deltaMs = now - this.lastTime
      this.lastTime = now
      const dt = Math.min(0.05, deltaMs / 1000) // clamp long frames
      this.update(dt, deltaMs)
      this.rafId = requestAnimationFrame(loop)
    }
    this.rafId = requestAnimationFrame(loop)
  }

  private update(dt: number, deltaMs: number) {
    // Performance monitoring (invisible quality scaling).
    if (this.performance.sample(deltaMs)) {
      this.emit() // tier changed → let visuals rebudget particles
    }

    if (this.transition.isActive()) {
      this.updateTransition(dt)
      return
    }

    this.scene.tick(dt)
    const scene = this.scene.getCurrent()

    if (this.isSceneComplete(scene)) {
      this.startTransition()
      return
    }

    this.publishSceneState(scene)
  }

  /**
   * A scene is complete when its narration track ends (the definitive trigger,
   * Document 1, §14) or, when no narration exists, when its configured
   * duration elapses. This makes the film fully playable with or without audio.
   */
  private isSceneComplete(scene: SceneConfig): boolean {
    // While a real narration track is still speaking, the scene never ends.
    if (this.audio.isNarrationActive()) return false
    // A narration track that actually played and finished is the definitive
    // trigger (Document 1, §14).
    if (this.audio.didNarrationPlay() && this.audio.hasEndedNarration()) {
      return true
    }
    // Otherwise (no narration recorded yet, or autoplay blocked) the scene runs
    // for its configured duration so the documentary is always complete.
    return this.scene.getProgress() >= 1
  }

  private startTransition() {
    if (this.scene.isLast()) {
      this.running = false
      cancelAnimationFrame(this.rafId)
      this.audio.stopNarration()
      this.setStatus("ended")
      return
    }
    const next = this.scene.getNext()
    this.transition.begin(next?.transitionIn ?? "fade-black")
    this.emit()
  }

  private updateTransition(dt: number) {
    const result = this.transition.tick(dt)
    if (result === "swap") {
      // Swap scenes hidden behind the transition cover.
      this.scene.advance()
      this.audio.playNarration(this.scene.getCurrent().narration)
    }
    this.patch({
      transition: {
        active: this.transition.isActive(),
        type: this.transition.getType(),
        progress: this.transition.getProgress(),
      },
    })
    if (result === "complete") {
      this.publishSceneState(this.scene.getCurrent(), true)
    }
  }

  private publishSceneState(scene: SceneConfig, force = false) {
    const elapsed = this.scene.getElapsed()
    const activeCues = this.animation.getActiveCues(scene, elapsed)
    const caption = this.animation.getCaption(scene, elapsed)
    const phase = this.scene.getPhase()

    const next: Partial<DocumentarySnapshot> = {
      sceneIndex: this.scene.getIndex(),
      sceneId: scene.id,
      phase,
      sceneProgress: this.scene.getProgress(),
      activeCues,
      caption,
      activeNarrator: this.audio.getActiveNarrator(),
      transition: {
        active: false,
        type: this.transition.getType(),
        progress: 0,
      },
    }

    if (force || this.sceneStateChanged(next)) {
      this.patch(next)
    }
  }

  /** Diff only the discrete fields that should trigger a React re-render. */
  private sceneStateChanged(next: Partial<DocumentarySnapshot>): boolean {
    const s = this.snapshot
    return (
      next.sceneId !== s.sceneId ||
      next.phase !== s.phase ||
      next.caption !== s.caption ||
      next.activeNarrator !== s.activeNarrator ||
      next.transition?.active !== s.transition.active ||
      (next.activeCues?.length ?? 0) !== s.activeCues.length
    )
  }

  // ---- Snapshot plumbing ----------------------------------------------------

  private setStatus(status: DocumentarySnapshot["status"]) {
    this.status = status
    this.patch({ status })
  }

  private patch(partial: Partial<DocumentarySnapshot>) {
    this.snapshot = { ...this.snapshot, ...partial }
    this.emit()
  }

  private emit() {
    for (const listener of this.listeners) listener(this.snapshot)
  }

  private buildSnapshot(): DocumentarySnapshot {
    const scene = this.scene.getCurrent()
    return {
      status: "idle",
      sceneIndex: 0,
      sceneId: scene.id,
      phase: "initialization",
      sceneProgress: 0,
      activeCues: [],
      caption: null,
      loadProgress: 0,
      transition: { active: false, type: "fade-black", progress: 0 },
      captionsEnabled: this.captionsEnabled,
      activeNarrator: null,
      muted: this.muted,
    }
  }
}

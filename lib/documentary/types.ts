/**
 * types.ts
 * -----------------------------------------------------------------------------
 * Definitive shared type vocabulary for the animated documentary engine.
 *
 * These types are the contract between every manager (Document 2, Chapter 5)
 * and the React rendering layer. Content (scenes, narration, cues) is expressed
 * purely through these structures so that assets can be hot-swapped without
 * touching engine logic (Document 2, Chapter 13 & 15).
 */

/** High level lifecycle of the whole documentary (Documentary Flow, Ch. 4). */
export type DocumentaryStatus =
  | "idle" // waiting for the viewer gesture required to unlock audio
  | "loading" // Resource Manager is preloading assets
  | "playing" // documentary is running
  | "paused" // internal pause (never exposed as a control during playback)
  | "ended" // credits finished

/**
 * The distinct environments a scene can inhabit (Document 1, §11).
 * Each drives a different procedural backdrop + lighting mood.
 */
export type EnvironmentType =
  | "void"
  | "ancient-greece"
  | "laboratory"
  | "atomic-world"
  | "workbench"
  | "technological"

/** Cinematic transition vocabulary (Document 1, §15 / Document 2, Ch. dedicated). */
export type TransitionType =
  | "fade-black"
  | "fade-white"
  | "dissolve"
  | "pan"
  | "zoom"

/**
 * The universal learning cycle every scene moves through
 * (Document 2, Ch. 6 "Scene Lifecycle" / "Educational Consistency").
 */
export type ScenePhase =
  | "initialization"
  | "introduction"
  | "development"
  | "reinforcement"
  | "conclusion"
  | "transition"

/** Emotional tone of a scene (Document 1, §21 "Emotional Direction"). */
export type EmotionTone =
  | "curiosity"
  | "wonder"
  | "exploration"
  | "dynamic"
  | "understanding"

/**
 * A single time-stamped narration beat. Cues are the mechanism that lets
 * animation "anticipate" narration (Document 2, Ch. 4 & 9): a visual keyed to a
 * cue is revealed the instant the cue becomes active, before/while the narrator
 * speaks. Times are expressed in seconds, relative to the start of the scene.
 */
export interface NarrationCue {
  /** Stable id referenced by scene visuals to know when to reveal. */
  id: string
  /** Seconds from scene start when this beat begins. */
  start: number
  /** Optional explicit end; defaults to the next cue's start. */
  end?: number
  /**
   * Optional caption. Text is intentionally minimal (Document 1, §5): only
   * scientist names, experiment names, keywords, dates, formulas or symbols.
   */
  caption?: string
}

/** A single camera pose sampled along the scene timeline (Document 2, Ch. 10). */
export interface CameraKeyframe {
  /** Seconds from scene start. */
  time: number
  /** Horizontal offset in viewport-relative units (%). Positive pans right. */
  x: number
  /** Vertical offset in viewport-relative units (%). Positive pans down. */
  y: number
  /** Zoom factor. 1 = neutral framing. */
  scale: number
}

/**
 * Identifies which narrator speaks each audio clip.
 */
export type NarratorId = "emiliano" | "isabela"

/**
 * One independent narration audio.
 */
export interface NarrationSegment {
  narrator: NarratorId
  src: string
}

/**
 * Ordered narration sequence for a scene.
 */
export interface SceneNarration {
  segments: NarrationSegment[]
}

/**
 * Complete declarative definition of one documentary scene.
 * A scene = one educational objective (Document 2, Ch. 6). Everything the
 * engine needs to play a scene lives here so scenes stay self-contained.
 */
export interface SceneConfig {
  id: string
  /** Permitted on-screen label: concept, scientist or experiment name. */
  title: string
  /** Optional secondary label (e.g. a date) — permitted text only. */
  subtitle?: string
  /** Developer-facing educational objective (never rendered). */
  objective: string
  environment: EnvironmentType
  emotion: EmotionTone
  /** Fallback duration in seconds when no narration audio is present. */
  duration: number

  /** Optional ordered narration sequence. */
  narration?: SceneNarration
  /** Transition used to enter this scene. */
  transitionIn: TransitionType
  /** Ordered narration beats / reveal triggers. */
  cues: NarrationCue[]
  /** Camera choreography across the scene. */
  camera: CameraKeyframe[]
}

/**
 * Immutable snapshot the engine publishes to React on every meaningful change.
 * Kept intentionally small and change-diffed so React only re-renders on
 * discrete events (scene / phase / cue / transition changes), never per frame.
 */
export interface DocumentarySnapshot {
  status: DocumentaryStatus
  /** Index of the active scene within the ordered scene list. */
  sceneIndex: number
  sceneId: string
  phase: ScenePhase
  /** Progress through the current scene, 0..1. */
  sceneProgress: number
  /** Ids of cues currently active (used by visuals to reveal content). */
  activeCues: string[]
  /** Current narration caption, if any. */
  caption: string | null
  /** Asset preload progress, 0..1. */
  loadProgress: number
  transition: TransitionState
  /** Whether the viewer has enabled optional captions. */
  captionsEnabled: boolean
  /** Narrator currently speaking, if any. */
  activeNarrator: NarratorId | null
  /** Whether audio is muted. */
  muted: boolean
}

/** Live transition state consumed by the transition overlay. */
export interface TransitionState {
  active: boolean
  type: TransitionType
  /** 0..1 progress through the transition. */
  progress: number
}

/** Camera transform ready to be applied to the stage. */
export interface CameraTransform {
  x: number
  y: number
  scale: number
}

/** A resource descriptor the Resource Manager knows how to preload. */
export interface ResourceDescriptor {
  id: string
  kind: "image" | "audio"
  src: string
}

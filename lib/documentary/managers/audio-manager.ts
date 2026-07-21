/**
 * AudioManager (Document 2, Ch. 5 & 11)
 * -----------------------------------------------------------------------------
 * Coordinates narration, ambient music and volume balancing. Narration is
 * always the dominant layer; while it plays the ambient bed is smoothly ducked
 * (Document 1, §14). The manager is fully tolerant of absent audio files so the
 * documentary remains a complete timeline-driven experience even before any
 * narration has been recorded (assets are hot-swappable, Document 2, Ch. 13).
 */

import { AUDIO } from "../config"
import type { NarratorId, SceneNarration } from "../types"

export class AudioManager {
  private narration: HTMLAudioElement | null = null
  private music: HTMLAudioElement | null = null
  private musicSrc: string | null = null

  private currentNarration: SceneNarration | null = null
  private currentSegmentIndex = 0
  private activeNarrator: NarratorId | null = null

  private muted = false
  private narrationEnded = false
  private hasNarration = false
  private duckRaf = 0

  setMusicTrack(src: string) {
    this.musicSrc = src
  }

  setMuted(muted: boolean) {
    this.muted = muted
    if (this.music) this.music.muted = muted
    if (this.narration) this.narration.muted = muted
  }

  isMuted(): boolean {
    return this.muted
  }

  /** Start the persistent ambient bed (Document 1, §14). */
  startMusic() {
    if (typeof window === "undefined" || !this.musicSrc) return
    if (!this.music) {
      this.music = new Audio(this.musicSrc)
      this.music.loop = true
      this.music.muted = this.muted
    }
    this.music.volume = AUDIO.musicBase
    void this.music.play().catch(() => { })
  }

  /**
   * Play a scene's narration track. If the file is missing/unplayable we mark
   * narration as "ended" immediately so scene progression falls back to the
   * scene's configured duration.
   */
  playNarration(narration?: SceneNarration) {
    this.stopNarration()
    this.narrationEnded = false
    this.hasNarration = false

    this.currentNarration = narration ?? null
    this.currentSegmentIndex = 0

    if (
      typeof window === "undefined" ||
      !narration ||
      narration.segments.length === 0
    ) {
      this.narrationEnded = true
      this.restoreMusic()
      return
    }

    this.playSegment(0)
  }

stopNarration() {
    if (this.narration) {
      this.narration.onplaying = null
      this.narration.onerror = null
      this.narration.onended = null
      this.narration.pause()
      this.narration = null
    }

    this.currentNarration = null
    this.currentSegmentIndex = 0
    this.activeNarrator = null
    this.hasNarration = false
    this.narrationEnded = false
  }

  /** True when a real narration track exists and has finished playing. */
  isNarrationActive(): boolean {
    return this.hasNarration && !this.narrationEnded
  }

  hasEndedNarration(): boolean {
    return this.narrationEnded
  }

  getActiveNarrator(): NarratorId | null {
    return this.activeNarrator
  }

  /**
   * True only when a real narration track actually began playback (the
   * "playing" event fired). Missing/blocked audio never sets this, so scene
   * progression can safely fall back to the configured duration timeline.
   */
  didNarrationPlay(): boolean {
    return this.hasNarration
  }

  pause() {
    this.narration?.pause()
    this.music?.pause()
  }

  resume() {
    if (this.narration && !this.narrationEnded) {
      void this.narration.play().catch(() => { })
    }
    if (this.music) void this.music.play().catch(() => { })
  }

  private playSegment(index: number) {
    if (!this.currentNarration) {
      this.narrationEnded = true
      this.restoreMusic()
      return
    }

    if (index >= this.currentNarration.segments.length) {
      this.activeNarrator = null
      this.narrationEnded = true
      this.restoreMusic()
      return
    }

    this.currentSegmentIndex = index

    const segment = this.currentNarration.segments[index]

    console.log("▶ Reproduciendo segmento:", index, segment.src)

    this.activeNarrator = segment.narrator

if (this.narration) {
      const old = this.narration
      old.onplaying = null
      old.onerror = null
      old.onended = null
      old.pause()
      this.narration = null
    }

    const el = new Audio(segment.src)
    el.muted = this.muted
    el.volume = AUDIO.narration

    this.narration = el

    el.onplaying = () => {
      this.hasNarration = true
      this.duckMusic()
    }

    el.onerror = (event) => {
      console.error("❌ Error reproduciendo:", segment.src, event)
      this.playSegment(index + 1)
    }

    el.onended = () => {
      console.log("⏹ Terminó segmento:", index)
      this.playSegment(index + 1)
    }

    void el.play().catch(() => {
      this.playSegment(index + 1)
    })
  }

  private duckMusic() {
    this.rampMusic(AUDIO.musicDucked)
  }

  private restoreMusic() {
    this.rampMusic(AUDIO.musicBase)
  }

  /** Smoothly ramp the ambient bed to a target volume (audio ducking). */
  private rampMusic(target: number) {
    if (typeof window === "undefined" || !this.music) return
    cancelAnimationFrame(this.duckRaf)
    const music = this.music
    const start = music.volume
    const startedAt = performance.now()
    const durationMs = AUDIO.duckRamp * 1000
    const step = (now: number) => {
      const t = Math.min(1, (now - startedAt) / durationMs)
      music.volume = start + (target - start) * t
      if (t < 1) this.duckRaf = requestAnimationFrame(step)
    }
    this.duckRaf = requestAnimationFrame(step)
  }

  dispose() {
    cancelAnimationFrame(this.duckRaf)
    this.stopNarration()
    if (this.music) {
      this.music.pause()
      this.music = null
    }
  }
}

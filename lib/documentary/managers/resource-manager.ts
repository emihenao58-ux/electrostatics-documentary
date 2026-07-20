/**
 * ResourceManager (Document 2, Ch. 5 & 13)
 * -----------------------------------------------------------------------------
 * Sole owner of external asset loading. Every other system requests assets
 * through this manager — no subsystem touches the network directly. Loading is
 * tolerant: a missing optional asset (e.g. narration not yet recorded) never
 * interrupts the documentary (Document 2, Ch. 4 "Error Handling Philosophy").
 */

import type { ResourceDescriptor } from "../types"

export class ResourceManager {
  private loaded = new Set<string>()
  private progress = 0

  getProgress(): number {
    return this.progress
  }

  isLoaded(id: string): boolean {
    return this.loaded.has(id)
  }

  /**
   * Preload a batch of resources, reporting fractional progress. Failures are
   * swallowed so that absent hot-swappable assets cannot stall playback.
   */
  async preload(
    resources: ResourceDescriptor[],
    onProgress?: (progress: number) => void,
  ): Promise<void> {
    if (resources.length === 0) {
      this.progress = 1
      onProgress?.(1)
      return
    }

    let completed = 0
    const bump = () => {
      completed += 1
      this.progress = completed / resources.length
      onProgress?.(this.progress)
    }

    await Promise.all(
      resources.map(async (res) => {
        try {
          if (res.kind === "image") {
            await this.loadImage(res.src)
          } else {
            await this.probeAudio(res.src)
          }
          this.loaded.add(res.id)
        } catch {
          // Optional / missing asset: continue silently.
        } finally {
          bump()
        }
      }),
    )
  }

  private loadImage(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof window === "undefined") return resolve()
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => resolve()
      img.onerror = () => reject(new Error(`image: ${src}`))
      img.src = src
    })
  }

  /** Resolve as soon as metadata is available; tolerate 404s quickly. */
  private probeAudio(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof window === "undefined") return resolve()
      const audio = new Audio()
      const done = () => resolve()
      audio.addEventListener("loadedmetadata", done, { once: true })
      audio.addEventListener("error", () => reject(new Error(`audio: ${src}`)), {
        once: true,
      })
      // Guard: never block the whole preload on one slow asset.
      setTimeout(resolve, 1500)
      audio.preload = "metadata"
      audio.src = src
    })
  }

  reset(): void {
    this.loaded.clear()
    this.progress = 0
  }
}

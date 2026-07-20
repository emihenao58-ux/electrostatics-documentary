"use client"

/**
 * DocumentaryPlayer — the top-level React shell.
 * -----------------------------------------------------------------------------
 * It owns nothing but the DocumentaryController (via useDocumentary) and maps
 * the engine's immutable snapshot onto the visual layers:
 *   Stage (camera + scene)  →  captions/titles  →  transition cover  →  controls
 * The film plays autonomously; the shell only exposes ambient controls and the
 * start / replay gestures required to unlock and restart audio.
 */

import { AnimatePresence } from "motion/react"
import { useCallback, useMemo } from "react"
import { useDocumentary } from "@/lib/documentary/hooks/use-documentary"
import { SCENES, MUSIC_SRC } from "@/lib/content/scenes"
import { Stage } from "./stage"
import { Caption, SceneTitle } from "./ui/narration"
import { TransitionOverlay } from "./ui/transition-overlay"
import { Controls } from "./ui/controls"
import { IdleScreen, LoadingScreen } from "./ui/gate"
import { EndScreen } from "./ui/end-screen"
import { CinematicFrame } from "./ui/cinematic-frame"

export function DocumentaryPlayer() {
  const { controller, snapshot } = useDocumentary({
    scenes: SCENES,
    musicSrc: MUSIC_SRC,
  })

  const scene = SCENES[snapshot.sceneIndex]

  const totalProgress = useMemo(() => {
    const per = 1 / SCENES.length
    return snapshot.sceneIndex * per + snapshot.sceneProgress * per
  }, [snapshot.sceneIndex, snapshot.sceneProgress])

  const start = useCallback(() => {
    void controller.start()
  }, [controller])

  const replay = useCallback(() => {
    controller.restart()
  }, [controller])

  const toggleCaptions = useCallback(() => {
    controller.setCaptionsEnabled(!snapshot.captionsEnabled)
  }, [controller, snapshot.captionsEnabled])

  const toggleMute = useCallback(() => {
    controller.setMuted(!snapshot.muted)
  }, [controller, snapshot.muted])

  const isPlaying = snapshot.status === "playing" || snapshot.status === "paused"
  // Titles show during a scene's opening beat; captions show when enabled.
  const showTitle =
    isPlaying &&
    snapshot.sceneProgress < 0.35 &&
    (scene.id === "opening" ||
      scene.id === "history" ||
      scene.id === "charges" ||
      scene.id === "methods" ||
      scene.id === "conclusion")

  return (
    <main className="relative h-dvh w-full overflow-hidden bg-background">
      <section
        aria-label="Documental animado: La Electrostática"
        className="relative h-full w-full"
      >
        {isPlaying && (
          <>
            <Stage
              controller={controller}
              scene={scene}
              activeCues={snapshot.activeCues}
              activeNarrator={snapshot.activeNarrator}
            />

            <SceneTitle
              title={scene.title}
              subtitle={scene.subtitle}
              show={showTitle}
            />

            {snapshot.captionsEnabled && (
              <Caption
                caption={snapshot.caption}
                speaker={snapshot.activeNarrator}
              />
            )}

            <TransitionOverlay transition={snapshot.transition} />

            <Controls
              captionsEnabled={snapshot.captionsEnabled}
              muted={snapshot.muted}
              onToggleCaptions={toggleCaptions}
              onToggleMute={toggleMute}
              totalProgress={totalProgress}
            />
          </>
        )}

        <AnimatePresence>
          {snapshot.status === "idle" && <IdleScreen key="idle" onStart={start} />}
          {snapshot.status === "loading" && (
            <LoadingScreen key="loading" progress={snapshot.loadProgress} />
          )}
        </AnimatePresence>

        {snapshot.status === "ended" && <EndScreen onReplay={replay} />}
      </section>

      <CinematicFrame />
    </main>
  )
}

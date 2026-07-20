"use client"

/**
 * Stage — the camera rig + scene router.
 * -----------------------------------------------------------------------------
 * Applies the active scene's camera choreography as a single Motion tween
 * (keyed to the scene id so it replays per scene) and routes to the correct
 * scene component. The camera lives here, wrapping every scene, so movement is
 * consistent and the scenes themselves never worry about framing.
 */

import { motion } from "motion/react"
import { useMemo } from "react"
import type { DocumentaryController } from "@/lib/documentary/managers/documentary-controller"
import type { SceneConfig } from "@/lib/documentary/types"
import { Environment } from "./environments/environment"
import { OpeningScene } from "./scenes/opening-scene"
import { HistoryScene } from "./scenes/history-scene"
import { ChargesScene } from "./scenes/charges-scene"
import { MethodsScene } from "./scenes/methods-scene"
import { ConclusionScene } from "./scenes/conclusion-scene"
import { CreditsScene } from "./scenes/credits-scene"
import { NarratorIndicator } from "./speakers/narrator-indicator"

function SceneBody({ id, cues }: { id: string; cues: Set<string> }) {
  switch (id) {
    case "opening":
      return <OpeningScene cues={cues} />
    case "history":
      return <HistoryScene cues={cues} />
    case "charges":
      return <ChargesScene cues={cues} />
    case "methods":
      return <MethodsScene cues={cues} />
    case "conclusion":
      return <ConclusionScene cues={cues} />
    case "credits":
      return <CreditsScene cues={cues} />
    default:
      return null
  }
}

export function Stage({
  controller,
  scene,
  activeCues,
  activeNarrator,
}: {
  controller: DocumentaryController
  scene: SceneConfig
  activeCues: string[]
  activeNarrator: "emiliano" | "isabela" | null
}) {
  const cueSet = useMemo(() => new Set(activeCues), [activeCues])
  const camera = useMemo(
    () => controller.camera.toMotionKeyframes(scene),
    [controller, scene],
  )

  return (
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        key={scene.id}
        className="absolute inset-0 will-change-transform"
        initial={{ x: camera.x[0], y: camera.y[0], scale: camera.scale[0] }}
        animate={{ x: camera.x, y: camera.y, scale: camera.scale }}
        transition={{
          duration: scene.duration,
          ease: "easeInOut",
          times: camera.times,
        }}
      >
        <Environment type={scene.environment} />
        <SceneBody id={scene.id} cues={cueSet} />
        <NarratorIndicator activeNarrator={activeNarrator} />
      </motion.div>

    </div>
  )
}

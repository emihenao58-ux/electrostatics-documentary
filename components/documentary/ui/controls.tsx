"use client"

/**
 * Controls — deliberately minimal (Document 1: the film plays autonomously).
 * During playback the viewer only gets ambient controls that never interrupt
 * the narrative: toggle captions and mute. A progress ribbon at the very top
 * shows how far through the whole documentary we are.
 */

import { Captions, CaptionsOff, Volume2, VolumeX } from "lucide-react"

export function Controls({
  captionsEnabled,
  muted,
  onToggleCaptions,
  onToggleMute,
  totalProgress,
}: {
  captionsEnabled: boolean
  muted: boolean
  onToggleCaptions: () => void
  onToggleMute: () => void
  totalProgress: number
}) {
  return (
    <>
      {/* Whole-film progress ribbon */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-30 h-0.5 bg-border/40">
        <div
          className="h-full bg-primary/80 transition-[width] duration-500 ease-linear"
          style={{ width: `${Math.round(totalProgress * 100)}%` }}
        />
      </div>

      <div className="absolute right-4 top-4 z-30 flex items-center gap-2 sm:right-6 sm:top-6">
        <ControlButton
          label={captionsEnabled ? "Ocultar subtítulos" : "Mostrar subtítulos"}
          onClick={onToggleCaptions}
          active={captionsEnabled}
        >
          {captionsEnabled ? <Captions size={18} /> : <CaptionsOff size={18} />}
        </ControlButton>
        <ControlButton
          label={muted ? "Activar sonido" : "Silenciar"}
          onClick={onToggleMute}
          active={!muted}
        >
          {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </ControlButton>
      </div>
    </>
  )
}

function ControlButton({
  label,
  onClick,
  active,
  children,
}: {
  label: string
  onClick: () => void
  active: boolean
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-background/40 text-foreground/80 backdrop-blur-md transition-colors hover:bg-background/70 hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      {children}
    </button>
  )
}

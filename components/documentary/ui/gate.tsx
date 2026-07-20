"use client"

/**
 * Gate — the idle + loading experience shown before playback.
 * A viewer gesture is required to begin (this unlocks audio, Document 1, §14).
 * While assets preload we show an on-brand progress state, then the documentary
 * starts on its own and runs autonomously with no timeline scrubber.
 */

import { motion } from "motion/react"
import { ElectricEnergy } from "../electric-narrative/electric-energy"

export function IdleScreen({ onStart }: { onStart: () => void }) {
  return (
    <motion.div
      className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-10 px-6 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="relative">
        <ElectricEnergy x={0} y={0} size={90} filaments={5} />
      </div>
      <div className="flex flex-col items-center gap-3">
        <p className="font-mono text-xs uppercase tracking-[0.5em] text-primary">
          Documental
        </p>
        <h1 className="max-w-2xl font-serif text-4xl font-medium tracking-tight text-balance text-foreground sm:text-6xl">
          La Electrostática
        </h1>
        <p className="max-w-md text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
          Un viaje al origen de la electricidad, del ámbar de la antigua Grecia
          al interior del átomo.
        </p>
      </div>
      <button
        type="button"
        onClick={onStart}
        className="group inline-flex items-center gap-3 rounded-full border border-primary/40 bg-primary/10 px-8 py-3 font-mono text-sm uppercase tracking-widest text-primary transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
      >
        <span
          className="h-2 w-2 rounded-full bg-primary transition-colors group-hover:bg-primary-foreground"
          aria-hidden="true"
        />
        Comenzar
      </button>
    </motion.div>
  )
}

export function LoadingScreen({ progress }: { progress: number }) {
  return (
    <motion.div
      className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-8 px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <ElectricEnergy x={0} y={0} size={70} filaments={4} intensity={0.8} />
      <div className="flex w-64 flex-col gap-3">
        <div className="h-px w-full overflow-hidden bg-border">
          <motion.div
            className="h-full bg-primary"
            style={{ width: `${Math.round(progress * 100)}%` }}
            transition={{ ease: "linear" }}
          />
        </div>
        <span className="text-center font-mono text-xs uppercase tracking-[0.4em] text-muted-foreground">
          Cargando · {Math.round(progress * 100)}%
        </span>
      </div>
    </motion.div>
  )
}

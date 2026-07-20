"use client"

/**
 * Scene 4 — Electrification Methods (Document 1, §"Methods").
 * The three ways to charge a body — friction, contact, induction — each shown
 * as its own observable mini-experiment on a workbench. Only one method is on
 * stage at a time so the viewer's attention is never split.
 */

import { AnimatePresence, motion } from "motion/react"
import { Charge } from "../scientific/charge"
import { SparkCluster, TransferFlow, FieldArcs } from "../scientific/charge-transfer"

function MethodStage({
  active,
  children,
}: {
  active: boolean
  children: React.ReactNode
}) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -60 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/** Two objects on the bench, styled as neutral bodies that gain charge. */
function Body({ label, charged }: { label: string; charged: "+" | "-" | null }) {
  return (
    <div className="relative flex flex-col items-center gap-3">
      <motion.div
        className="flex h-28 w-24 items-center justify-center rounded-xl border border-border/70 bg-card/50 backdrop-blur-sm"
        animate={
          charged
            ? {
                boxShadow:
                  charged === "+"
                    ? "0 0 40px color-mix(in oklch, var(--electric-yellow), transparent 55%)"
                    : "0 0 40px color-mix(in oklch, var(--electric-blue), transparent 55%)",
              }
            : { boxShadow: "0 0 0px transparent" }
        }
        transition={{ duration: 0.8 }}
      >
        {charged ? <Charge sign={charged} size={44} /> : null}
      </motion.div>
      <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
    </div>
  )
}

export function MethodsScene({ cues }: { cues: Set<string> }) {
  const friction = cues.has("friction")
  const frictionCharged = cues.has("friction-charge")
  const contact = cues.has("contact")
  const contactCharged = cues.has("contact-charge")
  const induction = cues.has("induction")
  const inductionCharged = cues.has("induction-charge")

  return (
    <div className="absolute inset-0">
      <MethodStage active={friction && !contact}>
        <div className="relative flex items-center gap-16">
          <Body label="material A" charged={frictionCharged ? "-" : null} />
          <div className="relative flex h-10 w-16 items-center justify-center">
            <SparkCluster active={frictionCharged} />
            <motion.div
              className="text-3xl text-primary"
              animate={{ x: frictionCharged ? 0 : [0, -10, 10, 0] }}
              transition={{
                duration: 0.7,
                repeat: frictionCharged ? 0 : Number.POSITIVE_INFINITY,
              }}
            >
              ⟷
            </motion.div>
          </div>
          <Body label="material B" charged={frictionCharged ? "+" : null} />
        </div>
      </MethodStage>

      <MethodStage active={contact && !induction}>
        <div className="relative flex items-center gap-6">
          <Body label="cargado" charged="-" />
          <TransferFlow active={contactCharged} distance={110} />
          <Body label="neutro" charged={contactCharged ? "-" : null} />
        </div>
      </MethodStage>

      <MethodStage active={induction}>
        <div className="relative flex items-center gap-10">
          <Body label="inductor" charged="+" />
          <FieldArcs active={induction} width={180} />
          <Body label="conductor" charged={inductionCharged ? "-" : null} />
        </div>
      </MethodStage>
    </div>
  )
}
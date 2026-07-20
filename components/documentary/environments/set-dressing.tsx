"use client"

/**
 * SetDressing — procedural contextual props for each environment (Document 1,
 * §11 "Every topic lives in its own environment").
 * -----------------------------------------------------------------------------
 * These are silhouetted, rim-lit set pieces — columns, desks, scrolls, shelves,
 * jars and instruments — that give every scene depth and a sense of place so
 * the frame is never an empty gradient. They are strictly non-photographic and
 * on-palette (Document 1, §8), sit BEHIND the on-stage demonstration, and are
 * dim enough never to compete with the narration's focal element.
 *
 * No characters, no mascots — only inanimate historical / scientific objects.
 */

import { motion } from "motion/react"
import type { EnvironmentType } from "@/lib/documentary/types"

/* A dark silhouette fill with a faint warm/cool inner tone for material read. */
const SILHOUETTE = "color-mix(in oklch, var(--stage-deep), black 45%)"
const rim = (color: string) =>
  `drop-shadow(0 0 2px color-mix(in oklch, ${color}, transparent 55%))`

/* ------------------------------- Ancient Greece ------------------------------ */
function GreeceDressing() {
  const columns = [6, 20, 80, 94]
  return (
    <>
      {/* Fluted columns receding on both sides for depth */}
      {columns.map((left, i) => {
        const edge = left < 50
        const scale = edge ? (i === 0 ? 1 : 0.82) : i === 3 ? 1 : 0.82
        return (
          <div
            key={left}
            className="absolute bottom-0"
            style={{
              left: `${left}%`,
              height: `${58 * scale}%`,
              width: `${5 * scale}%`,
              transform: "translateX(-50%)",
              opacity: 0.55,
            }}
          >
            {/* shaft */}
            <div
              className="absolute inset-x-0 bottom-0 top-[8%] rounded-t-sm"
              style={{
                background: `linear-gradient(90deg, ${SILHOUETTE}, color-mix(in oklch, var(--electric-yellow), transparent 78%) 48%, ${SILHOUETTE})`,
                boxShadow: "inset 0 0 12px rgba(0,0,0,0.6)",
              }}
            />
            {/* capital + base */}
            <div
              className="absolute inset-x-[-30%] top-0 h-[8%] rounded-sm"
              style={{ background: SILHOUETTE }}
            />
            <div
              className="absolute inset-x-[-30%] bottom-0 h-[5%] rounded-sm"
              style={{ background: SILHOUETTE }}
            />
          </div>
        )
      })}

      {/* Stone plinth / study table with a scroll and a breathing oil-lamp glow */}
      <div className="absolute bottom-[14%] left-1/2 -translate-x-1/2" style={{ opacity: 0.85 }}>
        <div
          className="relative h-16 w-72 rounded-md sm:w-96"
          style={{
            background: `linear-gradient(180deg, color-mix(in oklch, var(--electric-yellow), transparent 88%), ${SILHOUETTE})`,
            boxShadow: "0 18px 40px rgba(0,0,0,0.5)",
          }}
        >
          {/* unrolled parchment scroll on the table */}
          <div
            className="absolute -top-3 left-6 h-6 w-28 -rotate-2 rounded-full"
            style={{
              background:
                "linear-gradient(180deg, color-mix(in oklch, var(--electric-yellow), white 10%), color-mix(in oklch, var(--electric-yellow), black 20%))",
              opacity: 0.5,
              filter: rim("var(--electric-yellow)"),
            }}
          />
          {/* stacked ancient books */}
          <div
            className="absolute -top-5 right-8 h-5 w-16 rounded-sm"
            style={{ background: SILHOUETTE, filter: rim("var(--electric-yellow)") }}
          />
          <div
            className="absolute -top-8 right-10 h-3 w-12 rounded-sm"
            style={{ background: SILHOUETTE, filter: rim("var(--electric-yellow)") }}
          />
          {/* oil lamp flame */}
          <motion.div
            className="absolute -top-6 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full"
            style={{ background: "var(--electric-yellow)", filter: rim("var(--electric-yellow)") }}
            animate={{ opacity: [0.55, 1, 0.7, 1], scale: [1, 1.25, 0.95, 1.15] }}
            transition={{ duration: 2.4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          />
        </div>
      </div>
    </>
  )
}

/* --------------------------- Laboratory / Workbench -------------------------- */
function LabDressing() {
  return (
    <>
      {/* Back wall of shelves holding jars and bottles */}
      <div className="absolute inset-x-0 top-[16%] flex flex-col items-center gap-6" style={{ opacity: 0.4 }}>
        {[0, 1].map((shelf) => (
          <div key={shelf} className="relative w-[74%]">
            <div className="h-px w-full" style={{ background: "color-mix(in oklch, var(--electric-blue), transparent 55%)" }} />
            <div className="absolute bottom-0 flex w-full items-end justify-around">
              {Array.from({ length: 7 }).map((_, i) => {
                const tall = i % 3 === 0
                return (
                  <div
                    key={i}
                    className="rounded-t-sm"
                    style={{
                      width: tall ? 14 : 10,
                      height: tall ? 34 : 22,
                      background: `linear-gradient(180deg, color-mix(in oklch, var(--electric-blue), transparent 70%), ${SILHOUETTE})`,
                    }}
                  />
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Foreground workbench surface */}
      <div
        className="absolute inset-x-0 bottom-[10%] mx-auto h-3 w-[82%] rounded-full"
        style={{
          background: `linear-gradient(90deg, transparent, color-mix(in oklch, var(--electric-blue), transparent 60%), transparent)`,
          opacity: 0.5,
        }}
      />

      {/* A glass flask and a Leyden-jar silhouette flanking the stage */}
      <div className="absolute bottom-[12%] left-[10%]" style={{ opacity: 0.45 }}>
        <div
          className="h-16 w-12 rounded-b-[45%] rounded-t-md"
          style={{ background: `linear-gradient(180deg, color-mix(in oklch, var(--electric-blue), transparent 68%), ${SILHOUETTE})`, filter: rim("var(--electric-blue)") }}
        />
      </div>
      <div className="absolute bottom-[12%] right-[10%]" style={{ opacity: 0.45 }}>
        <div
          className="h-20 w-10 rounded-md"
          style={{ background: `linear-gradient(180deg, color-mix(in oklch, var(--electric-yellow), transparent 72%), ${SILHOUETTE})`, filter: rim("var(--electric-yellow)") }}
        />
      </div>
    </>
  )
}

/* ------------------------------- Atomic world ------------------------------- */
function AtomicDressing() {
  return (
    <div className="absolute inset-0 flex items-center justify-center" style={{ opacity: 0.35 }}>
      {[1, 1.7, 2.5].map((r, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border"
          style={{
            width: `${r * 26}vmin`,
            height: `${r * 26}vmin`,
            borderColor: "color-mix(in oklch, var(--electric-blue), transparent 70%)",
          }}
          animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
          transition={{ duration: 60 + i * 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        />
      ))}
    </div>
  )
}

/* ------------------------------- Technological ------------------------------- */
function TechDressing() {
  return (
    <div className="absolute inset-x-0 bottom-0 h-1/2" style={{ opacity: 0.3 }} aria-hidden="true">
      <svg width="100%" height="100%" viewBox="0 0 100 40" preserveAspectRatio="none">
        <g stroke="color-mix(in oklch, var(--electric-blue), transparent 40%)" strokeWidth="0.25" fill="none">
          <path d="M0 30 H30 V16 H52 V26 H72 V12 H100" />
          <path d="M0 36 H18 V24 H40 V34 H64 V22 H100" />
        </g>
        {[30, 52, 72, 18, 40, 64].map((x, i) => (
          <circle
            key={i}
            cx={x}
            cy={i < 3 ? [16, 26, 12][i] : [24, 34, 22][i - 3]}
            r="0.7"
            fill="var(--electric-blue)"
          />
        ))}
      </svg>
    </div>
  )
}

export function SetDressing({ type }: { type: EnvironmentType }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {type === "ancient-greece" && <GreeceDressing />}
      {(type === "laboratory" || type === "workbench") && <LabDressing />}
      {type === "atomic-world" && <AtomicDressing />}
      {type === "technological" && <TechDressing />}
    </div>
  )
}

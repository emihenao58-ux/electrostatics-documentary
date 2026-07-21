/**
 * scenes.ts — Documentary content (Document 1 + Document 2, Ch. 4 "Flow")
 * -----------------------------------------------------------------------------
 * The complete, ordered scene script for:
 *   "LA ELECTROSTÁTICA — Un viaje al origen de la electricidad"
 *
 * This file is pure DATA. It is the single place a producer edits to change the
 * documentary: reorder scenes, adjust pacing (durations), retime narration cues
 * or point to recorded narration tracks. No engine code changes are required
 * (hot-swappable content, Document 2, Ch. 13 & 15).
 *
 * NARRATION:
 *   Each scene may reference a narration file under /public/audio/narration/.
 *   Those files are recorded by the team (Document 1, §14). Until they exist,
 *   the engine plays the documentary on the configured `duration` timeline, so
 *   the experience is always complete. Drop an mp3 with the matching name and
 *   the scene will automatically advance when the narration ends.
 *
 * ON-SCREEN TEXT:
 *   Captions are intentionally minimal (Document 1, §5): scientist names,
 *   experiment names, keywords, dates, formulas and charge symbols only.
 */

import type { SceneConfig } from "../documentary/types"

export const MUSIC_SRC = "/audio/music/ambient.ogg"

const narrationFolder = (scene: string) => `/audio/narration/${scene}`

export const SCENES: SceneConfig[] = [
  // 1 — OPENING SEQUENCE ------------------------------------------------------
  {
    id: "opening",
    title: "LA ELECTROSTÁTICA",
    subtitle: "Un viaje al origen de la electricidad",
    objective:
      "Establish tone and visual identity; introduce electrical energy as the narrative thread before any concept is explained.",
    environment: "void",
    emotion: "curiosity",
    duration: 19,

narration: {
  segments: [
    {
      narrator: "emiliano",
      src: `${narrationFolder("opening")}/01-emiliano.ogg`,
    },
    {
      narrator: "isabela",
      src: `${narrationFolder("opening")}/02-isabela.ogg`,
    },
    {
      narrator: "emiliano",
      src: `${narrationFolder("opening")}/03-emiliano.ogg`,
    },
  ],
},
    transitionIn: "fade-black",
    cues: [
      { id: "spark-birth", start: 0.8 },
      { id: "title-in", start: 4, caption: "" },
      { id: "energy-gather", start: 11 },
    ],
    camera: [
      { time: 0, x: 0, y: 0, scale: 1.25 },
      { time: 9, x: 0, y: 0, scale: 1 },
      { time: 19, x: 0, y: 0, scale: 1.05 },
    ],
  },

  // 2 — HISTORICAL INTRODUCTION ----------------------------------------------
  {
    id: "history",
    title: "Tales de Mileto",
    subtitle: "600 a. C.",
    objective:
      "Show the origin of the word 'electricity' through amber and friction in Ancient Greece; observation precedes explanation.",
    environment: "ancient-greece",
    emotion: "curiosity",
duration: 58,

narration: {
  segments: [
    {
      narrator: "emiliano",
      src: `${narrationFolder("history")}/01-emiliano.ogg`,
    },
    {
      narrator: "isabela",
      src: `${narrationFolder("history")}/02-isabela.ogg`,
    },
    {
      narrator: "emiliano",
      src: `${narrationFolder("history")}/03-emiliano.ogg`,
    },
    {
      narrator: "isabela",
      src: `${narrationFolder("history")}/04-isabela.ogg`,
    },
  ],
},

transitionIn: "dissolve",
    cues: [
      { id: "reveal-greece", start: 1 },
      { id: "reveal-thales", start: 7, caption: "Tales de Mileto" },
      { id: "show-amber", start: 18, caption: "ámbar" },
      { id: "rub-amber", start: 28 },
      { id: "attract-bits", start: 40 },
      { id: "greek-word", start: 50, caption: "ἤλεκτρον · elektron" },
    ],
    camera: [
      { time: 0, x: -6, y: 2, scale: 1.1 },
      { time: 18, x: 4, y: 0, scale: 1.2 },
      { time: 36, x: 8, y: -2, scale: 1.45 },
      { time: 58, x: 0, y: 0, scale: 1.1 },
    ],
  },

  // 3 — ELECTRICAL CHARGES ----------------------------------------------------
  {
    id: "charges",
    title: "Carga eléctrica",
    objective:
      "Explain the atom, protons and electrons, positive/negative charge, and attraction vs. repulsion through visual demonstration.",
    environment: "atomic-world",
    emotion: "wonder",
duration: 66,

narration: {
  segments: [
    {
      narrator: "emiliano",
      src: `${narrationFolder("charges")}/01-emiliano.ogg`,
    },
    {
      narrator: "isabela",
      src: `${narrationFolder("charges")}/02-isabela.ogg`,
    },
    {
      narrator: "emiliano",
      src: `${narrationFolder("charges")}/03-emiliano.ogg`,
    },
    {
      narrator: "isabela",
      src: `${narrationFolder("charges")}/04-isabela.ogg`,
    },
  ],
},

transitionIn: "zoom",
    cues: [
      { id: "reveal-atom", start: 1, caption: "el átomo" },
      { id: "show-nucleus", start: 9, caption: "protones +" },
      { id: "show-electrons", start: 18, caption: "electrones −" },
      { id: "charge-symbols", start: 27, caption: "+   −" },
      { id: "repulsion", start: 35, caption: "cargas iguales se repelen" },
      { id: "attraction", start: 44, caption: "cargas opuestas se atraen" },
      { id: "coulomb", start: 54, caption: "F = k · q₁q₂ / r²" },
    ],
    camera: [
      { time: 0, x: 0, y: 0, scale: 1.6 },
      { time: 18, x: 0, y: 0, scale: 1 },
      { time: 35, x: -6, y: 0, scale: 1.15 },
      { time: 44, x: 6, y: 0, scale: 1.15 },
      { time: 66, x: 0, y: 0, scale: 1 },
    ],
  },

  // 4 — ELECTRIFICATION METHODS ----------------------------------------------
  {
    id: "methods",
    title: "Métodos de electrización",
    objective:
      "Demonstrate the three ways to charge a body: friction, contact and induction, each as an observable experiment.",
    environment: "workbench",
    emotion: "exploration",
    duration: 95,
narration: {
  segments: [
    {
      narrator: "emiliano",
      src: `${narrationFolder("methods")}/01-emiliano.ogg`,
    },
    {
      narrator: "isabela",
      src: `${narrationFolder("methods")}/02-isabela.ogg`,
    },
    {
      narrator: "emiliano",
      src: `${narrationFolder("methods")}/03-emiliano.ogg`,
    },
    {
      narrator: "isabela",
      src: `${narrationFolder("methods")}/04-isabela.ogg`,
    },
    {
      narrator: "emiliano",
      src: `${narrationFolder("methods")}/05-emiliano.ogg`,
    },
  ],
},
    transitionIn: "pan",
    cues: [
      { id: "reveal-bench", start: 1 },
      { id: "friction", start: 8, caption: "Frotamiento" },
      { id: "friction-charge", start: 20 },
      { id: "contact", start: 38, caption: "Contacto" },
      { id: "contact-charge", start: 50 },
      { id: "induction", start: 68, caption: "Inducción" },
      { id: "induction-charge", start: 82 },
    ],
    camera: [
      { time: 0, x: 0, y: 2, scale: 1.1 },
      { time: 20, x: -10, y: 0, scale: 1.3 },
      { time: 50, x: 0, y: 0, scale: 1.3 },
      { time: 82, x: 10, y: 0, scale: 1.3 },
      { time: 95, x: 0, y: 0, scale: 1.05 },
    ],
  },

  // 5 — CONCLUSION ------------------------------------------------------------
  {
    id: "conclusion",
    title: "De la chispa a la ciencia",
    objective:
      "Synthesise the journey — from amber to atomic charge — leaving the viewer with understanding and appreciation.",
    environment: "technological",
    emotion: "understanding",
    duration: 38,
narration: {
  segments: [
    {
      narrator: "emiliano",
      src: `${narrationFolder("conclusion")}/01-emiliano.ogg`,
    },
    {
      narrator: "isabela",
      src: `${narrationFolder("conclusion")}/02-isabela.ogg`,
    },
    {
      narrator: "emiliano",
      src: `${narrationFolder("conclusion")}/03-emiliano.ogg`,
    },
    {
      narrator: "isabela",
      src: `${narrationFolder("conclusion")}/04-isabela.ogg`,
    },
  ],
},
    transitionIn: "fade-white",
    cues: [
      { id: "converge", start: 1 },
      { id: "timeline", start: 12, caption: "ámbar → átomo → energía" },
      { id: "closing-glow", start: 26 },
    ],
    camera: [
      { time: 0, x: 0, y: 0, scale: 1.2 },
      { time: 18, x: 0, y: 0, scale: 1 },
      { time: 38, x: 0, y: 0, scale: 1.3 },
    ],
  },

  // 6 — CREDITS ---------------------------------------------------------------
  {
  id: "credits",
  title: "Créditos",
  objective:
    "Close the documentary with a calm, on-brand credits sequence.",
  environment: "void",
  emotion: "understanding",
  duration: 18,

  transitionIn: "fade-black",

  cues: [
    { id: "credits-in", start: 1 },
    { id: "credits-thanks", start: 10, caption: "Gracias por acompañarnos." },
  ],

  camera: [
    { time: 0, x: 0, y: 0, scale: 1 },
    { time: 18, x: 0, y: -4, scale: 1.05 },
  ],
},
]
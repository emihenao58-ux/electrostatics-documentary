"use client"

/**
 * useDocumentary
 * -----------------------------------------------------------------------------
 * React binding for the DocumentaryController. Creates a single controller
 * instance for the lifetime of the player and exposes its snapshot via
 * useSyncExternalStore so components re-render only on discrete engine events.
 */

import { useCallback, useMemo, useRef, useSyncExternalStore } from "react"
import {
  DocumentaryController,
  type ControllerOptions,
} from "../managers/documentary-controller"
import type { DocumentarySnapshot } from "../types"

export function useDocumentary(options: ControllerOptions) {
  const controllerRef = useRef<DocumentaryController | null>(null)
  if (controllerRef.current === null) {
    controllerRef.current = new DocumentaryController(options)
  }
  const controller = controllerRef.current

  const subscribe = useCallback(
    (cb: () => void) => controller.subscribe(() => cb()),
    [controller],
  )
  const getSnapshot = useCallback(
    () => controller.getSnapshot(),
    [controller],
  )

  const snapshot: DocumentarySnapshot = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getSnapshot,
  )

  return useMemo(() => ({ controller, snapshot }), [controller, snapshot])
}

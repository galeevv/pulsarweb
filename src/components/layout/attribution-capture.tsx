"use client"

import { useEffect } from "react"
import { getFirstTouchAttribution } from "@/lib/attribution"

export function AttributionCapture() {
  useEffect(() => {
    getFirstTouchAttribution()
  }, [])
  return null
}

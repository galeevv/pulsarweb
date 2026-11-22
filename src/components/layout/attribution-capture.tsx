"use client"

import { useEffect } from "react"
import {
  clearFirstTouchAttribution,
  getFirstTouchAttribution,
} from "@/lib/attribution"
import {
  getCookieConsent,
  subscribeToCookieConsent,
} from "@/lib/cookie-consent"

export function AttributionCapture() {
  useEffect(() => {
    const syncAttribution = () => {
      if (getCookieConsent() === "accepted") getFirstTouchAttribution()
      else clearFirstTouchAttribution()
    }
    syncAttribution()
    return subscribeToCookieConsent(syncAttribution)
  }, [])
  return null
}

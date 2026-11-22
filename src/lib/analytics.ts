import type { RequestService } from "@/config/service-catalog"
import { getCookieConsent } from "./cookie-consent"

export type FunnelEvent = {
  name: "start_opened" | "start_begun" | "start_completed"
  service?: RequestService
}
export type AnalyticsAdapter = (
  event: Readonly<FunnelEvent>
) => void | Promise<void>
let adapter: AnalyticsAdapter | undefined

// A future consent-aware integration can install an adapter (e.g. reachGoal).
// No tracker, network request, event queue or personal data is created here.
export function setAnalyticsAdapter(next: AnalyticsAdapter) {
  adapter = next
  return () => {
    if (adapter === next) adapter = undefined
  }
}

export function trackFunnelEvent(event: FunnelEvent) {
  if (getCookieConsent() !== "accepted") return
  const safeEvent: FunnelEvent = {
    name: event.name,
    ...(event.service && { service: event.service }),
  }
  try {
    window.dispatchEvent(
      new CustomEvent("pulsarweb:analytics", { detail: safeEvent })
    )
  } catch {
    /* Analytics cannot break the request flow. */
  }
  try {
    void Promise.resolve(adapter?.(safeEvent)).catch(() => {})
  } catch {
    /* Also isolate synchronous adapter failures. */
  }
}

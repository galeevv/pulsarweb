import { afterEach, beforeEach, expect, it, vi } from "vitest"
import { setCookieConsent } from "./cookie-consent"
import {
  setAnalyticsAdapter,
  trackFunnelEvent,
  type FunnelEvent,
} from "./analytics"

beforeEach(() => {
  const values = new Map<string, string>()
  vi.stubGlobal(
    "window",
    Object.assign(new EventTarget(), {
      localStorage: {
        getItem: (key: string) => values.get(key),
        setItem: (key: string, value: string) => values.set(key, value),
      },
    })
  )
  setCookieConsent("accepted")
})
afterEach(() => {
  vi.unstubAllGlobals()
})

it("emits typed funnel events without requiring a provider or including arbitrary data", () => {
  const listener = vi.fn()
  window.addEventListener("pulsarweb:analytics", listener)
  trackFunnelEvent({
    name: "start_completed",
    service: "telegram",
    email: "private@example.com",
  } as FunnelEvent)
  expect(listener.mock.calls[0][0].detail).toEqual({
    name: "start_completed",
    service: "telegram",
  })
})

it("suppresses events and delivery after analytics consent is declined", () => {
  const listener = vi.fn()
  const adapter = vi.fn()
  window.addEventListener("pulsarweb:analytics", listener)
  const detach = setAnalyticsAdapter(adapter)
  try {
    setCookieConsent("declined")
    trackFunnelEvent({ name: "start_opened" })
    expect(listener).not.toHaveBeenCalled()
    expect(adapter).not.toHaveBeenCalled()
  } finally {
    detach()
  }
})

it("supports an optional adapter and unregistering it", () => {
  const adapter = vi.fn()
  const detach = setAnalyticsAdapter(adapter)
  trackFunnelEvent({ name: "start_opened" })
  detach()
  trackFunnelEvent({ name: "start_begun" })
  expect(adapter).toHaveBeenCalledExactlyOnceWith({ name: "start_opened" })
})

it("isolates both synchronous and asynchronous provider failures", async () => {
  for (const adapter of [
    () => {
      throw new Error("offline")
    },
    () => Promise.reject(new Error("offline")),
  ]) {
    const detach = setAnalyticsAdapter(adapter)
    expect(() => trackFunnelEvent({ name: "start_completed" })).not.toThrow()
    await Promise.resolve()
    detach()
  }
})

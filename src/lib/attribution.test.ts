import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

const values = new Map<string, string>()
let storage: {
  getItem: ReturnType<typeof vi.fn>
  setItem: ReturnType<typeof vi.fn>
}
beforeEach(() => {
  vi.resetModules()
  values.clear()
  storage = {
    getItem: vi.fn((key: string) => values.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => {
      values.set(key, value)
    }),
  }
  vi.stubGlobal("window", {
    location: {
      href: "https://studio.example/services/landing-pages?utm_source=yandex&utm_medium=cpc&utm_campaign=launch&utm_content=ad1&utm_term=website",
    },
    sessionStorage: storage,
  })
  vi.stubGlobal("document", {
    referrer: "https://search.example/results?private=value#section",
  })
})
afterEach(() => {
  vi.unstubAllGlobals()
})

describe("first-touch attribution", () => {
  it("retains all five tags, entry page and referrer across navigation and reload", async () => {
    const first = await import("./attribution")
    const expected = {
      landingPage: "/services/landing-pages",
      referrer: "https://search.example/results",
      utmSource: "yandex",
      utmMedium: "cpc",
      utmCampaign: "launch",
      utmContent: "ad1",
      utmTerm: "website",
    }
    expect(first.getFirstTouchAttribution()).toEqual(expected)
    window.location.href = "https://studio.example/start?utm_source=second"
    expect(first.getFirstTouchAttribution()).toEqual(expected)
    vi.resetModules()
    expect((await import("./attribution")).getFirstTouchAttribution()).toEqual(
      expected
    )
  })

  it("does not overwrite a direct first visit with later campaign tags", async () => {
    window.location.href = "https://studio.example/"
    const { getFirstTouchAttribution } = await import("./attribution")
    expect(getFirstTouchAttribution()?.utmSource).toBeUndefined()
    window.location.href = "https://studio.example/start?utm_source=internal"
    expect(getFirstTouchAttribution()?.landingPage).toBe("/")
    expect(getFirstTouchAttribution()?.utmSource).toBeUndefined()
  })

  it.each([
    "not-json",
    '{"landingPage":"//foreign.example"}',
    '{"landingPage":"/","referrer":"javascript:bad"}',
  ])("recovers from malformed storage: %s", async (stored) => {
    const { attributionStorageKey, getFirstTouchAttribution } =
      await import("./attribution")
    values.set(attributionStorageKey, stored)
    expect(getFirstTouchAttribution()?.utmSource).toBe("yandex")
  })

  it("survives blocked storage and retains the in-memory first touch", async () => {
    storage.getItem.mockImplementation(() => {
      throw new Error("blocked")
    })
    storage.setItem.mockImplementation(() => {
      throw new Error("blocked")
    })
    const { getFirstTouchAttribution } = await import("./attribution")
    expect(getFirstTouchAttribution()?.utmSource).toBe("yandex")
    window.location.href = "https://studio.example/start"
    expect(getFirstTouchAttribution()?.landingPage).toBe(
      "/services/landing-pages"
    )
  })

  it("bounds campaign text and drops unsafe referrers", async () => {
    const { captureAttribution } = await import("./attribution")
    const result = captureAttribution(
      `https://studio.example/?utm_term=${"a".repeat(300)}`,
      "https://user:password@example.com/"
    )
    expect(result.utmTerm).toHaveLength(200)
    expect(result.referrer).toBeUndefined()
  })
})

import { afterEach, describe, expect, it, vi } from "vitest"
import type { Lead } from "@/modules/leads"
import { TelegramLeadNotification } from "../telegram/telegram-notification"

vi.mock("server-only", () => ({}))
afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

const lead: Lead = {
  id: "lead-test",
  publicId: "PW-1001",
  requestKind: "PROJECT",
  companyContext: undefined,
  projectReference: undefined,
  sourceUrl: undefined,
  landingPage: undefined,
  referrer: undefined,
  utmSource: undefined,
  utmMedium: undefined,
  utmCampaign: undefined,
  utmContent: undefined,
  utmTerm: undefined,
  name: "<b>Client</b>",
  email: "client@example.com",
  company: undefined,
  phone: undefined,
  telegram: undefined,
  budget: undefined,
  service: "websites",
  description: "<script>alert(1)</script> " + "x".repeat(5000),
  consentVersion: "2026-10-06",
  createdAt: new Date("2026-10-06T00:00:00Z"),
}

describe("notification adapters with mocked network", () => {
  it("keeps Telegram text inert and within provider limits", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(Response.json({ ok: true, result: { message_id: 1 } }))
    vi.stubGlobal("fetch", fetchMock)
    await new TelegramLeadNotification("test-token", "test-chat").send(lead)
    const body = JSON.parse(fetchMock.mock.calls[0][1].body)
    expect(body.text.length).toBeLessThanOrEqual(4096)
    expect(body.parse_mode).toBeUndefined()
    expect(body.link_preview_options.is_disabled).toBe(true)
  })

  it("rejects provider HTTP and malformed success responses", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response("unavailable", { status: 503 }))
    vi.stubGlobal("fetch", fetchMock)
    const telegram = new TelegramLeadNotification("test-token", "test-chat")
    await expect(telegram.send(lead)).rejects.toMatchObject({
      code: "http",
      status: 503,
    })
    fetchMock.mockResolvedValue(Response.json({ ok: false }))
    await expect(telegram.send(lead)).rejects.toThrow()
  })

  it("does not retry Telegram after an ambiguous network failure", async () => {
    const fetchMock = vi
      .fn()
      .mockRejectedValue(
        new Error("https://api.telegram.org/botSECRET/sendMessage")
      )
    vi.stubGlobal("fetch", fetchMock)
    await expect(
      new TelegramLeadNotification("SECRET", "chat").send(lead)
    ).rejects.toMatchObject({
      code: "network",
      message: "Notification delivery failed: network",
    })
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it.each([{}, { ok: true }, { ok: false, message: "secret" }])(
    "requires a real Telegram message result: %j",
    async (payload) => {
      vi.stubGlobal("fetch", vi.fn().mockResolvedValue(Response.json(payload)))
      await expect(
        new TelegramLeadNotification("token", "chat").send(lead)
      ).rejects.toMatchObject({ code: "invalid-response" })
    }
  )

  it("bounds a hanging request and reports a sanitized timeout", async () => {
    const controller = new AbortController()
    const timeout = vi
      .spyOn(AbortSignal, "timeout")
      .mockReturnValue(controller.signal)
    vi.stubGlobal(
      "fetch",
      vi.fn(
        (_url, init) =>
          new Promise((_resolve, reject) => {
            init.signal.addEventListener(
              "abort",
              () => reject(controller.signal.reason),
              { once: true }
            )
          })
      )
    )
    const promise = new TelegramLeadNotification("secret", "chat").send(lead)
    controller.abort(new Error("private network details"))
    await expect(promise).rejects.toMatchObject({ code: "timeout" })
    expect(timeout).toHaveBeenCalledWith(8000)
  })


})

import { afterEach, describe, expect, it, vi } from "vitest"
import type { Lead } from "@/modules/leads"
import { ResendEmailProvider } from "../email/resend-email-provider"
import { LeadEmailNotification } from "../email/lead-email-notification"
import { TelegramLeadNotification } from "../telegram/telegram-notification"

vi.mock("server-only", () => ({}))
afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

const lead: Lead = {
  id: "lead-test",
  name: "<b>Client</b>",
  email: "client@example.com",
  company: undefined,
  phone: undefined,
  telegram: undefined,
  budget: undefined,
  service: "websites",
  message: "<script>alert(1)</script> " + "x".repeat(5000),
  consentVersion: "2026-10-06",
  createdAt: new Date("2026-10-06T00:00:00Z"),
}

describe("notification adapters with mocked network", () => {
  it("emails only the configured owner using plain text and a stable idempotency key", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(Response.json({ id: "email-test" }))
    vi.stubGlobal("fetch", fetchMock)
    const notification = new LeadEmailNotification(
      new ResendEmailProvider("test-key", "studio@example.com"),
      "owner@example.com"
    )
    await notification.send(lead)
    const [, options] = fetchMock.mock.calls[0]
    const body = JSON.parse(options.body)
    expect(body.to).toEqual(["owner@example.com"])
    expect(body.reply_to).toBe("client@example.com")
    expect(body.html).toBeUndefined()
    expect(body.text).toContain("<script>")
    expect(options.headers["Idempotency-Key"]).toBe("lead-created/lead-test")
  })

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

  it("retries a transient Resend failure with the same idempotency key and body", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response("private provider failure", { status: 503 })
      )
      .mockResolvedValueOnce(Response.json({ id: "email-test" }))
    vi.stubGlobal("fetch", fetchMock)
    await new LeadEmailNotification(
      new ResendEmailProvider("test-key", "studio@example.com"),
      "owner@example.com"
    ).send(lead)
    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(fetchMock.mock.calls[0][1]).toEqual(fetchMock.mock.calls[1][1])
    expect(fetchMock.mock.calls[0][1].redirect).toBe("error")
  })

  it.each([401, 403, 422, 429])(
    "does not retry a permanent or long rate-limit response: %s",
    async (status) => {
      const fetchMock = vi.fn().mockResolvedValue(
        new Response("sensitive payload", {
          status,
          headers: { "Retry-After": "60" },
        })
      )
      vi.stubGlobal("fetch", fetchMock)
      await expect(
        new LeadEmailNotification(
          new ResendEmailProvider("secret-key", "studio@example.com"),
          "owner@example.com"
        ).send(lead)
      ).rejects.toMatchObject({ code: "http", status })
      expect(fetchMock).toHaveBeenCalledTimes(1)
    }
  )

  it("honors a short Retry-After for Resend within the shared deadline", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(null, { status: 429, headers: { "Retry-After": "0" } })
      )
      .mockResolvedValueOnce(Response.json({ id: "email-test" }))
    vi.stubGlobal("fetch", fetchMock)
    await new LeadEmailNotification(
      new ResendEmailProvider("test-key", "studio@example.com"),
      "owner@example.com"
    ).send(lead)
    expect(fetchMock).toHaveBeenCalledTimes(2)
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

  it.each([{}, { ok: true }, { ok: false, description: "secret" }])(
    "requires a real Telegram message result: %j",
    async (payload) => {
      vi.stubGlobal("fetch", vi.fn().mockResolvedValue(Response.json(payload)))
      await expect(
        new TelegramLeadNotification("token", "chat").send(lead)
      ).rejects.toMatchObject({ code: "invalid-response" })
    }
  )

  it("rejects malformed Resend success without leaking the response", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(Response.json({ secret: "provider payload" }))
    vi.stubGlobal("fetch", fetchMock)
    await expect(
      new LeadEmailNotification(
        new ResendEmailProvider("key", "studio@example.com"),
        "owner@example.com"
      ).send(lead)
    ).rejects.toMatchObject({
      code: "invalid-response",
      message: "Notification delivery failed: invalid-response",
    })
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

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

  it("does not fabricate reply-to for leads without email", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(Response.json({ id: "email-test" }))
    vi.stubGlobal("fetch", fetchMock)
    await new LeadEmailNotification(
      new ResendEmailProvider("key", "studio@example.com"),
      "owner@example.com"
    ).send({ ...lead, email: undefined, telegram: "@client_test" })
    expect(JSON.parse(fetchMock.mock.calls[0][1].body).reply_to).toBeUndefined()
  })
})

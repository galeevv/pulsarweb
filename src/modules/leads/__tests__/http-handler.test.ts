import { describe, expect, it, vi } from "vitest"
import { createLeadHttpHandler } from "../infrastructure/http-handler"
import { createLeadSchema } from "../domain/schema"
import { validLead } from "./fixtures"
import { IdempotencyConflictError, SpamSubmissionError } from "../domain/ports"

function setup(trustProxy = false) {
  const execute = vi
    .fn()
    .mockResolvedValue({ leadId: "lead-1", publicId: "PW-1001", created: true })
  const consume = vi
    .fn()
    .mockResolvedValue({ allowed: true, retryAfterSeconds: 600 })
  const globalConsume = vi
    .fn()
    .mockResolvedValue({ allowed: true, retryAfterSeconds: 600 })
  const handler = createLeadHttpHandler({
    createLead: { execute },
    rateLimiter: { consume },
    globalRateLimiter: { consume: globalConsume },
    siteUrl: "https://pulsar.example",
    trustProxy,
    logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
  })
  const request = (body: string, extraHeaders: Record<string, string> = {}) =>
    new Request("https://pulsar.example/api/leads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: "https://pulsar.example",
        ...extraHeaders,
      },
      body,
    })
  return { handler, execute, consume, globalConsume, request }
}

describe("lead HTTP boundary", () => {
  it("stops at the global limit before consuming a client bucket or storing a lead", async () => {
    const { handler, request, globalConsume, consume, execute } = setup()
    globalConsume.mockResolvedValue({ allowed: false, retryAfterSeconds: 45 })
    const response = await handler(request(JSON.stringify(validLead())))
    expect(response.status).toBe(429)
    expect(response.headers.get("Retry-After")).toBe("45")
    expect(consume).not.toHaveBeenCalled()
    expect(execute).not.toHaveBeenCalled()
  })

  it("fails closed with a safe response when the persistent limiter is unavailable", async () => {
    const { handler, request, globalConsume, consume, execute } = setup()
    globalConsume.mockRejectedValue(new Error("private database details"))
    const response = await handler(request(JSON.stringify(validLead())))
    expect(response.status).toBe(503)
    expect(await response.json()).toMatchObject({
      ok: false,
      error: { code: "UNAVAILABLE" },
      requestId: response.headers.get("X-Request-Id"),
    })
    expect(consume).not.toHaveBeenCalled()
    expect(execute).not.toHaveBeenCalled()
  })
  it("returns 200 for a previously saved request without leaking its payload", async () => {
    const { handler, request, execute } = setup()
    execute.mockResolvedValue({
      leadId: "lead-1",
      publicId: "PW-1001",
      created: false,
    })
    const response = await handler(request(JSON.stringify(validLead())))
    expect(response.status).toBe(200)
    expect(response.headers.get("Cache-Control")).toBe("no-store")
    expect(await response.json()).toEqual({
      ok: true,
      leadId: "lead-1",
      publicId: "PW-1001",
    })
  })

  it.each([
    [new IdempotencyConflictError(), 409, "SUBMISSION_CONFLICT"],
    [new SpamSubmissionError(), 400, "SUBMISSION_REJECTED"],
  ])(
    "maps application failures to a stable HTTP contract",
    async (error, status, code) => {
      const { handler, request, execute } = setup()
      execute.mockRejectedValue(error)
      const response = await handler(request(JSON.stringify(validLead())))
      expect(response.status).toBe(status)
      expect(await response.json()).toMatchObject({
        ok: false,
        error: { code },
        requestId: response.headers.get("X-Request-Id"),
      })
    }
  )

  it("rejects malformed JSON and unsupported media types", async () => {
    const { handler, request, execute } = setup()
    expect((await handler(request("{"))).status).toBe(400)
    expect(
      (await handler(request("{}", { "Content-Type": "text/plain" }))).status
    ).toBe(415)
    expect(execute).not.toHaveBeenCalled()
  })

  it("accepts JSON media types case-insensitively", async () => {
    const { handler, request } = setup()
    expect(
      (
        await handler(
          request("{}", { "Content-Type": "Application/JSON; charset=utf-8" })
        )
      ).status
    ).toBe(201)
  })

  it("separates clients only behind an explicitly trusted proxy", async () => {
    const { handler, request, consume } = setup(true)
    await handler(request("{}", { "x-real-ip": "192.0.2.1" }))
    await handler(request("{}", { "x-real-ip": "192.0.2.2" }))
    expect(consume.mock.calls[0][0]).not.toBe(consume.mock.calls[1][0])
    expect(consume.mock.calls[0][0]).not.toContain("192.0.2.1")
    await handler(request("{}", { "x-real-ip": "192.0.2.1, 192.0.2.2" }))
    await handler(request("{}"))
    expect(consume.mock.calls[2][0]).toBe(consume.mock.calls[3][0])
  })

  it("returns 201, a safe response and a correlation identifier", async () => {
    const { handler, request } = setup()
    const response = await handler(request(JSON.stringify(validLead())))
    expect(response.status).toBe(201)
    expect(response.headers.get("X-Request-Id")).toBeTruthy()
    expect(await response.json()).toEqual({
      ok: true,
      leadId: "lead-1",
      publicId: "PW-1001",
    })
  })

  it("rejects another origin before executing or touching rate limits", async () => {
    const { handler, request, consume, execute } = setup()
    expect(
      (await handler(request("{}", { Origin: "https://another.example" })))
        .status
    ).toBe(403)
    expect(consume).not.toHaveBeenCalled()
    expect(execute).not.toHaveBeenCalled()
  })

  it("ignores spoofed forwarding headers unless proxy trust is enabled", async () => {
    const { handler, request, consume } = setup()
    await handler(request("{}", { "x-real-ip": "192.0.2.1" }))
    await handler(request("{}", { "x-real-ip": "192.0.2.2" }))
    expect(consume.mock.calls[0][0]).toBe(consume.mock.calls[1][0])
  })

  it("returns Retry-After and does not execute rate limited requests", async () => {
    const { handler, request, consume, execute } = setup()
    consume.mockResolvedValue({ allowed: false, retryAfterSeconds: 200 })
    const response = await handler(request("{}"))
    expect(response.status).toBe(429)
    expect(response.headers.get("Retry-After")).toBe("200")
    expect(execute).not.toHaveBeenCalled()
  })

  it("rejects oversized actual bodies even without a Content-Length header", async () => {
    const { handler, request, execute } = setup()
    expect((await handler(request("a".repeat(33_000)))).status).toBe(413)
    expect(execute).not.toHaveBeenCalled()
  })

  it("returns a field error for invalid input", async () => {
    const { handler, request, execute } = setup()
    execute.mockImplementation((input) => createLeadSchema.parse(input))
    const response = await handler(
      request(JSON.stringify(validLead({ email: "" })))
    )
    expect(response.status).toBe(422)
    expect((await response.json()).error.fieldErrors.telegram).toHaveLength(1)
  })

  it("does not reveal infrastructure error details", async () => {
    const { handler, request, execute } = setup()
    execute.mockRejectedValue(new Error("secret database path and password"))
    const response = await handler(request("{}"))
    expect(response.status).toBe(503)
    expect(await response.text()).not.toContain("password")
  })
})

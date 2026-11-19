import { afterEach, expect, it, vi } from "vitest"
const handler = vi.hoisted(() => vi.fn())
vi.mock("@/modules/leads/server", () => ({ getLeadHandler: handler }))
import { POST } from "./route"

afterEach(() => { vi.unstubAllEnvs(); vi.clearAllMocks() })

it("blocks demo before database and notifications", async () => {
  vi.stubEnv("NEXT_PUBLIC_DEMO_MODE", "true")
  const response = await POST(new Request("http://localhost/api/leads", { method: "POST" }))
  expect(response.status).toBe(503)
  expect(handler).not.toHaveBeenCalled()
})

it("uses the real handler outside demo", async () => {
  vi.stubEnv("NEXT_PUBLIC_DEMO_MODE", "false")
  handler.mockReturnValue(async () => Response.json({ ok: true }))
  expect((await POST(new Request("http://localhost/api/leads", { method: "POST" }))).status).toBe(200)
  expect(handler).toHaveBeenCalledOnce()
})

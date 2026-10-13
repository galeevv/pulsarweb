import { describe, expect, it } from "vitest"
import { contactQuerySchema, leadApiResponseSchema } from "../contracts"

describe("lead delivery contracts", () => {
  it("accepts a service deep link and ignores unknown or repeated query values", () => {
    expect(contactQuerySchema.parse({ service: "telegram" }).service).toBe(
      "telegram"
    )
    for (const service of [undefined, "unknown", ["telegram", "desktop"]]) {
      expect(contactQuerySchema.parse({ service }).service).toBeUndefined()
    }
  })

  it.each([
    null,
    {},
    { ok: true },
    { ok: true, leadId: "" },
    { ok: false },
    { ok: "true", leadId: "lead-1" },
  ])("does not accept a malformed response as a saved lead: %j", (response) => {
    expect(leadApiResponseSchema.safeParse(response).success).toBe(false)
  })
})

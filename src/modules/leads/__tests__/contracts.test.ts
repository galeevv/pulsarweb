import { describe, expect, it } from "vitest"
import { contactQuerySchema, leadApiResponseSchema } from "../contracts"
import { projectRequestHref } from "../domain/request-config"
import { createLeadSchema } from "../domain/schema"
import { validLead } from "./fixtures"

describe("lead delivery contracts", () => {
  it.each([
    ["websites", "landing-pages"],
    ["web-systems", "other"],
    ["desktop", "other"],
  ])(
    "maps legacy %s links without rewriting stored request payloads",
    (legacy, current) => {
      expect(contactQuerySchema.parse({ service: legacy }).service).toBe(
        current
      )
      const href = new URL(projectRequestHref(legacy), "https://studio.example")
      expect(href.searchParams.get("service")).toBe(current)
      expect(href.searchParams.get("source")).toBe(`/services/${legacy}`)
      expect(
        createLeadSchema.parse({ ...validLead(), service: legacy }).service
      ).toBe(legacy)
    }
  )
  it("accepts a service deep link and ignores unknown or repeated query values", () => {
    expect(contactQuerySchema.parse({}).service).toBeUndefined()
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

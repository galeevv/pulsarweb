import { describe, expect, it } from "vitest"
import { createLeadSchema } from "../domain/schema"
import { validLead } from "./fixtures"

describe("lead schema", () => {
  it("normalizes whitespace and empty optional values", () => {
    const result = createLeadSchema.parse(
      validLead({ name: "  Анна  ", company: " ", phone: "", telegram: "" })
    )
    expect(result.name).toBe("Анна")
    expect(result.company).toBeUndefined()
    expect(result.phone).toBeUndefined()
  })

  it.each([
    { email: "client@example.com" },
    { email: "", phone: "+7 (999) 123-45-67" },
    { email: "", telegram: "@pulsar_client" },
  ])("accepts one available contact: %j", (contact) => {
    expect(createLeadSchema.safeParse(validLead(contact)).success).toBe(true)
  })

  it.each([
    { email: "", phone: "", telegram: "" },
    { email: "not-an-email" },
    { phone: "hello1234567" },
    { telegram: "https://evil.example/user" },
    { description: "small" },
    { description: "x".repeat(5001) },
    { submissionId: "reuse-this" },
  ])("rejects invalid input: %j", (fields) => {
    expect(createLeadSchema.safeParse(validLead(fields)).success).toBe(false)
  })

  it("requires explicit consent and a supported service", () => {
    expect(
      createLeadSchema.safeParse({ ...validLead(), consent: false }).success
    ).toBe(false)
    expect(
      createLeadSchema.safeParse({ ...validLead(), service: "unknown" }).success
    ).toBe(false)
  })
})

describe("project request fields", () => {
  it.each([
    "landing-pages",
    "corporate-websites",
    "ecommerce",
    "websites",
    "web-systems",
    "telegram",
    "desktop",
    "support",
    "other",
  ])("accepts %s and ignores spoofed lifecycle fields", (service) => {
    const result = createLeadSchema.parse({
      ...validLead(),
      service,
      status: "WON",
      requestKind: "SUPPORT",
    })
    expect(result).not.toHaveProperty("status")
    expect(result).not.toHaveProperty("requestKind")
  })
  it("rejects infrastructure as an order and invalid budget or timeline", () => {
    for (const values of [
      { service: "infrastructure" },
      { budget: "free" },
      { timeline: "tomorrow" },
      { companyContext: "x".repeat(3001) },
    ])
      expect(
        createLeadSchema.safeParse({ ...validLead(), ...values }).success
      ).toBe(false)
  })
  it("normalizes international phone and Telegram handles", () => {
    const result = createLeadSchema.parse(
      validLead({ telegram: "GaLeeV66", phone: "+44 (20) 1234-5678" })
    )
    expect(result.telegram).toBe("@galeev66")
    expect(result.phone).toBe("+442012345678")
  })
})

it("accepts a callback request without a description", () => {
  const result = createLeadSchema.parse({
    ...validLead(),
    description: undefined,
  })
  expect(result.description).toBe("")
})

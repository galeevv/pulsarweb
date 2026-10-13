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
    { message: "small" },
    { message: "x".repeat(5001) },
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

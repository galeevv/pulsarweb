import { describe, expect, it } from "vitest"
import { formatLeadMessage } from "./lead-message"
import { createLeadSchema } from "@/modules/leads/domain/schema"
import { validLead } from "@/modules/leads/__tests__/fixtures"
import type { Lead } from "@/modules/leads"
function lead(overrides: Partial<Lead> = {}): Lead {
  return {
    ...createLeadSchema.parse(validLead()),
    id: "internal",
    publicId: "PW-1042",
    requestKind: "PROJECT",
    consentVersion: "2026-10-15",
    createdAt: new Date("2026-10-15T05:30:00Z"),
    ...overrides,
  }
}
describe("Telegram lead formatter", () => {
  it.each([
    ["landing-pages", "Лендинг под рекламу"],
    ["corporate-websites", "Корпоративный сайт"],
    ["ecommerce", "Интернет-магазин"],
    ["telegram", "Бизнес в Telegram"],
  ] as const)("formats the current product %s", (service, title) => {
    expect(formatLeadMessage(lead({ service }))).toContain(title)
  })
  it("includes human labels, public number, contacts, source and owner-local date", () => {
    const text = formatLeadMessage(
      lead({
        budget: "100–200 тыс. ₽",
        timeline: "1–3 месяца",
        sourceUrl: "/services/web-systems",
      })
    )
    for (const value of [
      "🚀 Новая заявка · PW-1042",
      "Web-системы",
      "client@example.com",
      "100–200 тыс. ₽",
      "1–3 месяца",
      "/services/web-systems",
      "10:30",
    ])
      expect(text).toContain(value)
    for (const value of ["internal", "undefined", "null", "Компания / продукт"])
      expect(text).not.toContain(value)
  })
  it("distinguishes support and includes the previous project", () => {
    const text = formatLeadMessage(
      lead({
        service: "support",
        requestKind: "SUPPORT",
        projectReference: "Pulsar Example",
      })
    )
    expect(text).toContain("🛠 Заявка на сопровождение")
    expect(text).toContain("Pulsar Example")
  })
  it("limits long input without losing contacts and keeps submitted markup literal", () => {
    const text = formatLeadMessage(
      lead({
        description: "<b>hello</b>" + "x".repeat(5000),
        companyContext: "x".repeat(3000),
        sourceUrl: "x".repeat(2048),
      })
    )
    expect(text.length).toBeLessThan(3900)
    expect(text).toContain("<b>hello</b>")
    expect(text).toContain("client@example.com")
  })
})

import { randomUUID } from "node:crypto"
import type { CreateLeadInput } from "../domain/schema"

export function validLead(
  overrides: Partial<CreateLeadInput> = {}
): CreateLeadInput {
  return {
    name: "Тестовый клиент",
    email: "client@example.com",
    service: "web-systems",
    description: "Нужна система для обработки входящих заявок.",
    consent: true,
    website: "",
    submissionId: randomUUID(),
    ...overrides,
  }
}

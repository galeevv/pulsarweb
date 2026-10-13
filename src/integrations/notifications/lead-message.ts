import type { Lead } from "@/modules/leads"

export function formatLeadMessage(lead: Lead): string {
  return [
    "Новая заявка · PulsarWeb",
    `ID: ${lead.id}`,
    `Создана (UTC): ${lead.createdAt.toISOString()}`,
    `Имя: ${lead.name}`,
    lead.company && `Компания: ${lead.company}`,
    lead.email && `Email: ${lead.email}`,
    lead.phone && `Телефон: ${lead.phone}`,
    lead.telegram && `Telegram: ${lead.telegram}`,
    `Направление: ${lead.service}`,
    lead.budget && `Бюджет: ${lead.budget}`,
    "",
    lead.message,
    "",
    `Версия согласия: ${lead.consentVersion}`,
  ]
    .filter((line) => line !== undefined)
    .join("\n")
}

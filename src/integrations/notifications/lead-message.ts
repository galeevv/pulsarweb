import type { Lead } from "@/modules/leads"
import { serviceLabel } from "@/config/service-catalog"

export function formatLeadMessage(lead: Lead): string {
  const section = (title: string, value?: string) =>
    value ? `${title}\n${value}` : undefined
  // Keep every section (especially contacts) visible within Telegram's message limit.
  const excerpt = (text: string, max: number) =>
    text.length > max
      ? `${text.slice(0, max).replace(/[\uD800-\uDBFF]$/, "")}… [Полный текст в базе]`
      : text
  return [
    `${lead.requestKind === "SUPPORT" ? "🛠 Заявка на сопровождение" : "🚀 Новая заявка"} · ${lead.publicId}`,
    serviceLabel(lead.service),
    section("Проект PulsarWeb", lead.projectReference),
    section("Клиент", [lead.name, lead.company].filter(Boolean).join("\n")),
    section("Задача", excerpt(lead.description, 1800)),
    section(
      "Компания / продукт",
      lead.companyContext && excerpt(lead.companyContext, 450)
    ),
    section("Бюджет", lead.budget),
    section("Срок", lead.timeline),
    section(
      "Контакты",
      [
        lead.telegram && `Telegram: ${lead.telegram}`,
        lead.phone && `Телефон: ${lead.phone}`,
        lead.email && `Email: ${lead.email}`,
      ]
        .filter(Boolean)
        .join("\n")
    ),
    section("Источник", lead.sourceUrl && excerpt(lead.sourceUrl, 250)),
    section(
      "Дата (Екатеринбург)",
      new Intl.DateTimeFormat("ru-RU", {
        dateStyle: "long",
        timeStyle: "short",
        timeZone: "Asia/Yekaterinburg",
      }).format(lead.createdAt)
    ),
  ]
    .filter(Boolean)
    .join("\n\n")
}

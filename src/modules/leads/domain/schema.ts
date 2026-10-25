import { z } from "zod"

import { requestServiceIds, legacyServiceIds } from "@/config/service-catalog"
export const leadServiceIds = requestServiceIds
export const budgetOptions = [
  "50–100 тыс. ₽",
  "100–200 тыс. ₽",
  "200–500 тыс. ₽",
  "500 тыс. ₽+",
  "Пока не определён",
] as const
export const timelineOptions = [
  "Как можно скорее",
  "В течение месяца",
  "1–3 месяца",
  "3+ месяца",
  "Жёсткого срока нет",
] as const
export const leadStatuses = [
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "ESTIMATING",
  "PROPOSAL",
  "WON",
  "LOST",
  "SPAM",
] as const
export const consentVersion = "2026-10-15"
export const leadServiceSchema = z.enum(leadServiceIds, {
  error: "Выберите направление",
})
const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `Не более ${max} символов`)
    .optional()
    .transform((v) => v || undefined)
const email = optionalText(254).refine(
  (v) => !v || z.email().safeParse(v).success,
  "Укажите корректный email"
)
const phone = optionalText(40)
  .refine(
    (v) =>
      !v ||
      (/^\+?[\d\s()\-]+$/.test(v) &&
        v.replace(/\D/g, "").length >= 7 &&
        v.replace(/\D/g, "").length <= 15),
    "Укажите корректный телефон"
  )
  .transform((v) => v?.replace(/[\s()\-]/g, ""))
const telegram = optionalText(64)
  .refine(
    (v) => !v || /^@?[A-Za-z][A-Za-z0-9_]{4,31}$/.test(v),
    "Укажите Telegram в формате @username"
  )
  .transform((v) => (v ? `@${v.replace(/^@/, "").toLowerCase()}` : undefined))
const optionalUrl = optionalText(2048).refine(
  (v) =>
    !v ||
    (v.startsWith("/") && !v.startsWith("//")) ||
    (URL.canParse(v) && ["http:", "https:"].includes(new URL(v).protocol)),
  "Некорректный адрес страницы"
)

export const createLeadSchema = z
  .object({
    // Preserve legacy API values for payload hashes and idempotent retries.
    service: z.enum([...leadServiceIds, ...legacyServiceIds], {
      error: "Выберите направление",
    }),
    description: z
      .string()
      .trim()
      .min(20, "Расскажите о задаче чуть подробнее — от 20 символов")
      .max(5000, "Не более 5 000 символов")
      .or(z.literal(""))
      .default(""),
    companyContext: optionalText(3000),
    projectReference: optionalText(150),
    budget: z
      .enum(budgetOptions, { error: "Выберите бюджет из списка" })
      .optional(),
    timeline: z
      .enum(timelineOptions, { error: "Выберите срок из списка" })
      .optional(),
    name: z
      .string()
      .trim()
      .min(2, "Укажите ваше имя")
      .max(100, "Не более 100 символов"),
    company: optionalText(150),
    email,
    phone,
    telegram,
    consent: z.literal(true, {
      error: "Нужно согласие на обработку персональных данных",
    }),
    sourceUrl: optionalUrl,
    referrer: optionalUrl,
    utmSource: optionalText(200),
    utmMedium: optionalText(200),
    utmCampaign: optionalText(200),
    website: z.string().max(200).optional().default(""),
    submissionId: z.uuid({ error: "Обновите страницу и попробуйте снова" }),
  })
  .superRefine((value, context) => {
    if (!value.email && !value.phone && !value.telegram)
      context.addIssue({
        code: "custom",
        path: ["telegram"],
        message:
          "Оставьте хотя бы один способ связи: Telegram, телефон или email",
      })
  })
export type CreateLeadInput = z.input<typeof createLeadSchema>
export type ValidatedLeadInput = z.output<typeof createLeadSchema>
export type RequestService = (typeof leadServiceIds)[number]

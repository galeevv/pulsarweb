import { z } from "zod"

export const leadServiceIds = [
  "websites",
  "web-systems",
  "telegram",
  "desktop",
  "infrastructure",
  "support",
] as const
export const consentVersion = "2026-10-06"
export const leadServiceSchema = z.enum(leadServiceIds, {
  error: "Выберите направление",
})

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `Не более ${max} символов`)
    .optional()
    .transform((value) => value || undefined)
const email = z
  .string()
  .trim()
  .max(254)
  .refine(
    (value) => !value || z.email().safeParse(value).success,
    "Укажите корректный email"
  )
  .optional()
  .transform((value) => value || undefined)
const phone = optionalText(40).refine(
  (value) =>
    !value ||
    (/^\+?[\d\s()\-]+$/.test(value) &&
      value.replace(/\D/g, "").length >= 7 &&
      value.replace(/\D/g, "").length <= 15),
  "Укажите корректный телефон"
)
const telegram = optionalText(64).refine(
  (value) => !value || /^@?[A-Za-z][A-Za-z0-9_]{4,31}$/.test(value),
  "Укажите Telegram в формате @username"
)

export const createLeadSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Укажите ваше имя")
      .max(100, "Не более 100 символов"),
    company: optionalText(160),
    email,
    phone,
    telegram,
    service: leadServiceSchema,
    budget: optionalText(100),
    message: z
      .string()
      .trim()
      .min(10, "Расскажите о задаче чуть подробнее — от 10 символов")
      .max(5000, "Не более 5 000 символов"),
    consent: z.literal(true, {
      error: "Нужно согласие на обработку персональных данных",
    }),
    website: z.string().max(200).optional().default(""),
    submissionId: z.uuid({ error: "Обновите страницу и попробуйте снова" }),
  })
  .superRefine((value, context) => {
    if (!value.email && !value.phone && !value.telegram) {
      context.addIssue({
        code: "custom",
        path: ["email"],
        message:
          "Оставьте хотя бы один способ связи: email, телефон или Telegram",
      })
    }
  })

export type CreateLeadInput = z.input<typeof createLeadSchema>
export type ValidatedLeadInput = z.output<typeof createLeadSchema>

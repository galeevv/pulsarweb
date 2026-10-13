import { z } from "zod"
import { databaseUrlSchema } from "./database-url"

const optionalString = z
  .string()
  .trim()
  .optional()
  .transform((value) => value || undefined)

const siteUrlSchema = z
  .url()
  .refine((value) => {
    if (!URL.canParse(value)) return false
    const url = new URL(value)
    return (
      ["http:", "https:"].includes(url.protocol) &&
      !url.username &&
      !url.password &&
      url.pathname === "/" &&
      !url.search &&
      !url.hash
    )
  }, "SITE_URL must be an HTTP(S) origin without credentials, a path, query or fragment")
  .transform((value) => new URL(value).origin)

export const serverEnvSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  SITE_URL: siteUrlSchema.default("http://localhost:3000"),
  DATABASE_URL: databaseUrlSchema,
  TRUST_PROXY: z
    .enum(["true", "false"])
    .default("false")
    .transform((value) => value === "true"),
  RESEND_API_KEY: optionalString,
  EMAIL_FROM: optionalString,
  LEAD_NOTIFICATION_EMAIL: optionalString,
  TELEGRAM_BOT_TOKEN: optionalString,
  TELEGRAM_CHAT_ID: optionalString,
})

export type ServerEnv = z.output<typeof serverEnvSchema>

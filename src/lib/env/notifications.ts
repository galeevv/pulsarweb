import { z } from "zod"
import type { ServerEnv } from "./schema"

const telegramSchema = z.object({
  TELEGRAM_BOT_TOKEN: z.string().regex(/^\d+:[A-Za-z0-9_-]+$/),
  TELEGRAM_CHAT_ID: z.string().regex(/^(?:-?\d+|@[A-Za-z][A-Za-z0-9_]{4,31})$/),
})
const emailSchema = z.object({
  RESEND_API_KEY: z.string().regex(/^re_[A-Za-z0-9_]+$/),
  EMAIL_FROM: z.email(),
  LEAD_NOTIFICATION_EMAIL: z.email(),
})

function optionalChannel<T extends z.ZodRawShape>(
  schema: z.ZodObject<T>,
  env: ServerEnv
) {
  if (Object.keys(schema.shape).every((key) => !env[key as keyof ServerEnv])) {
    return { state: "disabled" as const }
  }
  const result = schema.safeParse(env)
  if (!result.success) {
    return {
      state: "invalid" as const,
      // Never return Zod issues or values: some issues contain the input.
      fields: [
        ...new Set(result.error.issues.map((issue) => String(issue.path[0]))),
      ],
    }
  }
  return { state: "ready" as const, config: result.data }
}

export function resolveNotificationConfig(env: ServerEnv) {
  return {
    telegram: optionalChannel(telegramSchema, {
      ...env,
      TELEGRAM_CHAT_ID: env.TELEGRAM_OWNER_CHAT_ID ?? env.TELEGRAM_CHAT_ID,
    }),
    email: optionalChannel(emailSchema, env),
  }
}

import "server-only"
import { serverEnvSchema, type ServerEnv } from "./schema"

let cached: ServerEnv | undefined

export function getServerEnv(): ServerEnv {
  if (cached) return cached
  const result = serverEnvSchema.safeParse(process.env)
  if (!result.success) {
    // Do not include environment values or Zod input in diagnostic output.
    throw new Error(
      `Invalid server configuration: ${result.error.issues.map((issue) => issue.path.join(".")).join(", ")}`
    )
  }
  cached = result.data
  return cached
}

export function getTelegramOwnerContact() {
  const configured = getServerEnv().TELEGRAM_OWNER_USERNAME
  const username =
    configured && /^[A-Za-z][A-Za-z0-9_]{4,31}$/.test(configured)
      ? configured
      : "galeev66"
  return { username, url: `https://t.me/${username}` }
}

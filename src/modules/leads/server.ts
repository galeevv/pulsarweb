import "server-only"
import { getDatabase } from "@/lib/db/client"
import { getServerEnv } from "@/lib/env/server"
import { logger } from "@/lib/logger"
import { createConfiguredNotifications } from "@/integrations/notifications/configured-notifications"
import { CreateLead } from "./application/create-lead"
import { PrismaLeadRepository } from "./infrastructure/prisma-lead-repository"
import { SqliteRateLimiter } from "./infrastructure/sqlite-rate-limiter"
import { createLeadHttpHandler } from "./infrastructure/http-handler"

let handler: ReturnType<typeof createLeadHttpHandler> | undefined

export function getLeadHandler() {
  if (handler) return handler
  const env = getServerEnv()
  const database = getDatabase()
  const notifications = createConfiguredNotifications(env, logger)

  handler = createLeadHttpHandler({
    createLead: new CreateLead(
      new PrismaLeadRepository(database),
      notifications,
      logger
    ),
    rateLimiter: new SqliteRateLimiter(database),
    globalRateLimiter: new SqliteRateLimiter(database, 200),
    siteUrl: env.SITE_URL,
    trustProxy: env.TRUST_PROXY,
    logger,
  })
  return handler
}

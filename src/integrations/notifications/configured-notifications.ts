import "server-only"
import type { LeadNotification } from "@/modules/leads"
import type { ServerEnv } from "@/lib/env/schema"
import { resolveNotificationConfig } from "@/lib/env/notifications"
import type { Logger } from "@/lib/logger"
import { LeadEmailNotification } from "../email/lead-email-notification"
import { ResendEmailProvider } from "../email/resend-email-provider"
import { TelegramLeadNotification } from "../telegram/telegram-notification"

export function createConfiguredNotifications(
  env: ServerEnv,
  logger: Logger
): LeadNotification[] {
  const channels = resolveNotificationConfig(env)
  const notifications: LeadNotification[] = []
  for (const [provider, channel] of Object.entries(channels)) {
    if (channel.state === "invalid") {
      logger.warn("notification.configuration_invalid", {
        provider,
        fields: channel.fields.join(","),
      })
    }
  }
  if (channels.telegram.state === "ready") {
    const config = channels.telegram.config
    notifications.push(
      new TelegramLeadNotification(
        config.TELEGRAM_BOT_TOKEN,
        config.TELEGRAM_CHAT_ID
      )
    )
  }
  if (channels.email.state === "ready") {
    const config = channels.email.config
    notifications.push(
      new LeadEmailNotification(
        new ResendEmailProvider(config.RESEND_API_KEY, config.EMAIL_FROM),
        config.LEAD_NOTIFICATION_EMAIL
      )
    )
  }
  return notifications
}

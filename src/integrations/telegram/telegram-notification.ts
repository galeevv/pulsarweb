import "server-only"
import { z } from "zod"
import type { Lead, LeadNotification } from "@/modules/leads"
import { formatLeadMessage } from "../notifications/lead-message"
import { requestProviderJson } from "../notifications/provider-request"

const responseSchema = z.object({
  ok: z.literal(true),
  result: z.object({ message_id: z.number().int().nonnegative() }),
})

export class TelegramLeadNotification implements LeadNotification {
  readonly name = "telegram"

  constructor(
    private readonly token: string,
    private readonly chatId: string
  ) {}

  async send(lead: Lead): Promise<void> {
    const message = formatLeadMessage(lead)
    // Plain text keeps submitted HTML/Markdown inert. Leave space below Telegram's 4096-character limit.
    const text =
      message.length > 3900
        ? `${message.slice(0, 3800).replace(/[\uD800-\uDBFF]$/, "")}\n\n[Сообщение сокращено. Полная заявка сохранена в базе.]`
        : message
    await requestProviderJson(
      `https://api.telegram.org/bot${this.token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: this.chatId,
          text,
          link_preview_options: { is_disabled: true },
        }),
      },
      responseSchema
    )
  }
}

import "server-only"
import { z } from "zod"
import type { EmailMessage, EmailProvider } from "./provider"
import { requestProviderJson } from "../notifications/provider-request"

const responseSchema = z.object({ id: z.string().min(1) })

export class ResendEmailProvider implements EmailProvider {
  constructor(
    private readonly apiKey: string,
    private readonly from: string
  ) {}

  async send(message: EmailMessage): Promise<void> {
    await requestProviderJson(
      "https://api.resend.com/emails",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
          "Idempotency-Key": message.idempotencyKey,
        },
        body: JSON.stringify({
          from: this.from,
          to: [message.to],
          subject: message.subject,
          text: message.text,
          reply_to: message.replyTo,
        }),
      },
      responseSchema,
      true
    )
  }
}

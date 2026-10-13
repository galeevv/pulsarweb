import type { Lead, LeadNotification } from "@/modules/leads"
import type { EmailProvider } from "./provider"
import { formatLeadMessage } from "../notifications/lead-message"

export class LeadEmailNotification implements LeadNotification {
  readonly name = "email"

  constructor(
    private readonly provider: EmailProvider,
    private readonly recipient: string
  ) {}

  async send(lead: Lead): Promise<void> {
    await this.provider.send({
      to: this.recipient,
      subject: "Новая заявка · PulsarWeb",
      text: formatLeadMessage(lead),
      replyTo: lead.email,
      idempotencyKey: `lead-created/${lead.id}`,
    })
  }
}

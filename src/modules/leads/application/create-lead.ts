import { consentVersion, createLeadSchema } from "../domain/schema"
import {
  SpamSubmissionError,
  NotificationDeliveryError,
  type LeadNotification,
  type LeadRepository,
  type NotificationStatus,
} from "../domain/ports"
import type { Logger } from "@/lib/logger"

export class CreateLead {
  constructor(
    private readonly repository: LeadRepository,
    private readonly notifications: readonly LeadNotification[],
    private readonly logger: Logger
  ) {}

  async execute(
    input: unknown,
    requestId: string
  ): Promise<{ leadId: string; created: boolean }> {
    const data = createLeadSchema.parse(input)
    if (data.website) throw new SpamSubmissionError()

    const { lead, created } = await this.repository.create(data, consentVersion)
    if (!created) return { leadId: lead.id, created: false }
    this.logger.info("lead.created", { leadId: lead.id, requestId })

    const results = await Promise.allSettled(
      this.notifications.map((notification) =>
        Promise.resolve().then(() => notification.send(lead))
      )
    )
    const failures = results.filter(
      (result) => result.status === "rejected"
    ).length
    let status: NotificationStatus = "skipped"
    if (results.length)
      status =
        failures === 0
          ? "sent"
          : failures === results.length
            ? "failed"
            : "partial"

    results.forEach((result, index) => {
      if (result.status === "rejected") {
        // Provider errors may contain tokens, URLs or customer data. Log only metadata.
        this.logger.warn("lead.notification_failed", {
          leadId: lead.id,
          requestId,
          provider: this.notifications[index].name,
          ...(result.reason instanceof NotificationDeliveryError && {
            reason: result.reason.code,
            ...(result.reason.status !== undefined && {
              status: result.reason.status,
            }),
          }),
        })
      }
    })
    try {
      await this.repository.setNotificationStatus(lead.id, status)
    } catch {
      this.logger.error("lead.notification_status_failed", {
        leadId: lead.id,
        requestId,
      })
    }

    return { leadId: lead.id, created: true }
  }
}

import type { ValidatedLeadInput } from "./schema"

export type Lead = Omit<
  ValidatedLeadInput,
  "website" | "submissionId" | "consent"
> & {
  id: string
  consentVersion: string
  createdAt: Date
}

export type NotificationStatus =
  "pending" | "sent" | "partial" | "failed" | "skipped"

export interface LeadRepository {
  create(
    input: ValidatedLeadInput,
    consentVersion: string
  ): Promise<{ lead: Lead; created: boolean }>
  setNotificationStatus(id: string, status: NotificationStatus): Promise<void>
}

export interface LeadNotification {
  readonly name: string
  send(lead: Lead): Promise<void>
}

export class NotificationDeliveryError extends Error {
  constructor(
    readonly code: "http" | "network" | "timeout" | "invalid-response",
    readonly status?: number
  ) {
    super(`Notification delivery failed: ${code}`)
    this.name = "NotificationDeliveryError"
  }
}

export interface RateLimiter {
  consume(key: string): Promise<{ allowed: boolean; retryAfterSeconds: number }>
}

export class IdempotencyConflictError extends Error {
  constructor() {
    super("Submission identifier has already been used with different data")
    this.name = "IdempotencyConflictError"
  }
}

export class SpamSubmissionError extends Error {
  constructor() {
    super("Submission rejected")
    this.name = "SpamSubmissionError"
  }
}

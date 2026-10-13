import { createHash } from "node:crypto"
import type {
  PrismaClient,
  Lead as DatabaseLead,
} from "@/generated/prisma/client"
import {
  IdempotencyConflictError,
  type Lead,
  type LeadRepository,
  type NotificationStatus,
} from "../domain/ports"
import type { ValidatedLeadInput } from "../domain/schema"

function toLead(record: DatabaseLead): Lead {
  return {
    id: record.id,
    name: record.name,
    company: record.company ?? undefined,
    email: record.email ?? undefined,
    phone: record.phone ?? undefined,
    telegram: record.telegram ?? undefined,
    service: record.service as Lead["service"],
    budget: record.budget ?? undefined,
    message: record.message,
    consentVersion: record.consentVersion,
    createdAt: record.createdAt,
  }
}

export class PrismaLeadRepository implements LeadRepository {
  constructor(private readonly database: PrismaClient) {}

  async create(input: ValidatedLeadInput, consentVersion: string) {
    const data = {
      name: input.name,
      company: input.company,
      email: input.email,
      phone: input.phone,
      telegram: input.telegram,
      service: input.service,
      budget: input.budget,
      message: input.message,
      consentVersion,
    }
    const payloadHash = createHash("sha256")
      .update(JSON.stringify(data))
      .digest("hex")

    try {
      const record = await this.database.lead.create({
        data: { ...data, payloadHash, submissionId: input.submissionId },
      })
      return { lead: toLead(record), created: true }
    } catch (error) {
      if (
        !(error instanceof Error) ||
        !("code" in error) ||
        error.code !== "P2002"
      )
        throw error
      // The unique constraint also protects simultaneous submissions in separate requests.
      const existing = await this.database.lead.findUnique({
        where: { submissionId: input.submissionId },
      })
      if (!existing) throw error
      if (existing.payloadHash !== payloadHash)
        throw new IdempotencyConflictError()
      return { lead: toLead(existing), created: false }
    }
  }

  async setNotificationStatus(
    id: string,
    notificationStatus: NotificationStatus
  ): Promise<void> {
    await this.database.lead.update({
      where: { id },
      data: { notificationStatus },
    })
  }
}

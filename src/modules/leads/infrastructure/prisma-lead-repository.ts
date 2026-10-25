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
    publicId: record.publicId,
    requestKind: record.requestKind as Lead["requestKind"],
    name: record.name,
    company: record.company ?? undefined,
    email: record.email ?? undefined,
    phone: record.phone ?? undefined,
    telegram: record.telegram ?? undefined,
    service: record.service as Lead["service"],
    budget: (record.budget as Lead["budget"]) ?? undefined,
    timeline: (record.timeline as Lead["timeline"]) ?? undefined,
    description: record.description,
    companyContext: record.companyContext ?? undefined,
    projectReference: record.projectReference ?? undefined,
    sourceUrl: record.sourceUrl ?? undefined,
    referrer: record.referrer ?? undefined,
    utmSource: record.utmSource ?? undefined,
    utmMedium: record.utmMedium ?? undefined,
    utmCampaign: record.utmCampaign ?? undefined,
    consentVersion: record.consentVersion,
    createdAt: record.createdAt,
  }
}

export class PrismaLeadRepository implements LeadRepository {
  constructor(private readonly database: PrismaClient) {}
  async create(input: ValidatedLeadInput, consentVersion: string) {
    const { website, submissionId, ...fields } = input
    void website
    const data = {
      ...fields,
      requestKind: input.service === "support" ? "SUPPORT" : "PROJECT",
      consentVersion,
    }
    const payloadHash = createHash("sha256")
      .update(JSON.stringify(data))
      .digest("hex")
    try {
      const record = await this.database.$transaction(async (tx) => {
        // SQLite serializes this atomic increment; no count + 1 race, even across processes.
        const sequence = await tx.leadSequence.update({
          where: { id: 1 },
          data: { value: { increment: 1 } },
        })
        return tx.lead.create({
          data: {
            ...data,
            payloadHash,
            submissionId,
            publicId: `PW-${sequence.value}`,
          },
        })
      })
      return { lead: toLead(record), created: true }
    } catch (error) {
      if (
        !(error instanceof Error) ||
        !("code" in error) ||
        error.code !== "P2002"
      )
        throw error
      const existing = await this.database.lead.findUnique({
        where: { submissionId },
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
  ) {
    await this.database.lead.update({
      where: { id },
      data: { notificationStatus },
    })
  }
}

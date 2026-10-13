import { describe, expect, it, vi } from "vitest"
import { CreateLead } from "../application/create-lead"
import {
  SpamSubmissionError,
  NotificationDeliveryError,
  type Lead,
  type LeadNotification,
  type LeadRepository,
} from "../domain/ports"
import { createLeadSchema } from "../domain/schema"
import { validLead } from "./fixtures"

function setup(notifications: LeadNotification[] = []) {
  const input = validLead()
  const lead: Lead = {
    ...createLeadSchema.parse(input),
    id: "lead-1",
    consentVersion: "2026-10-06",
    createdAt: new Date(),
  }
  const repository: LeadRepository = {
    create: vi.fn().mockResolvedValue({ lead, created: true }),
    setNotificationStatus: vi.fn().mockResolvedValue(undefined),
  }
  const logger = { info: vi.fn(), warn: vi.fn(), error: vi.fn() }
  return {
    input,
    lead,
    repository,
    logger,
    useCase: new CreateLead(repository, notifications, logger),
  }
}

describe("CreateLead", () => {
  it("attempts independent channels in parallel and records partial success with safe diagnostics", async () => {
    let release: (() => void) | undefined
    const gate = new Promise<void>((resolve) => {
      release = resolve
    })
    const telegram = vi.fn().mockImplementation(() => gate)
    const email = vi
      .fn()
      .mockRejectedValue(new NotificationDeliveryError("http", 403))
    const { input, repository, logger, useCase } = setup([
      { name: "telegram", send: telegram },
      { name: "email", send: email },
    ])
    const operation = useCase.execute(input, "request-parallel")
    await vi.waitFor(() => expect(email).toHaveBeenCalled())
    expect(telegram).toHaveBeenCalled()
    release?.()
    await expect(operation).resolves.toMatchObject({ created: true })
    expect(repository.setNotificationStatus).toHaveBeenCalledWith(
      "lead-1",
      "partial"
    )
    expect(logger.warn).toHaveBeenCalledWith("lead.notification_failed", {
      leadId: "lead-1",
      requestId: "request-parallel",
      provider: "email",
      reason: "http",
      status: 403,
    })
  })

  it("validates callers independently of HTTP before touching the repository", async () => {
    const { input, repository, useCase } = setup()
    await expect(
      useCase.execute({ ...input, consent: false }, "bot-request")
    ).rejects.toThrow()
    expect(repository.create).not.toHaveBeenCalled()
    expect(repository.setNotificationStatus).not.toHaveBeenCalled()
  })

  it("saves without optional providers", async () => {
    const { input, repository, useCase } = setup()
    await expect(useCase.execute(input, "request-1")).resolves.toEqual({
      leadId: "lead-1",
      created: true,
    })
    expect(repository.setNotificationStatus).toHaveBeenCalledWith(
      "lead-1",
      "skipped"
    )
  })

  it("saves before notifications and keeps success when providers fail", async () => {
    const send = vi
      .fn()
      .mockRejectedValue(new Error("token must never reach logs"))
    const { input, repository, logger, useCase } = setup([
      { name: "test-provider", send },
    ])
    await expect(useCase.execute(input, "request-1")).resolves.toMatchObject({
      leadId: "lead-1",
    })
    expect(
      vi.mocked(repository.create).mock.invocationCallOrder[0]
    ).toBeLessThan(send.mock.invocationCallOrder[0])
    expect(repository.setNotificationStatus).toHaveBeenCalledWith(
      "lead-1",
      "failed"
    )
    expect(JSON.stringify(logger.warn.mock.calls)).not.toContain("token must")
  })

  it("does not resend notifications on an idempotent retry", async () => {
    const send = vi.fn()
    const { input, lead, repository, useCase } = setup([{ name: "test", send }])
    vi.mocked(repository.create).mockResolvedValue({ lead, created: false })
    await expect(useCase.execute(input, "request-2")).resolves.toEqual({
      leadId: "lead-1",
      created: false,
    })
    expect(send).not.toHaveBeenCalled()
  })

  it("rejects honeypot submissions without persisting", async () => {
    const { input, repository, useCase } = setup()
    await expect(
      useCase.execute({ ...input, website: "spam" }, "request-1")
    ).rejects.toBeInstanceOf(SpamSubmissionError)
    expect(repository.create).not.toHaveBeenCalled()
  })

  it("survives notification-status failures after lead persistence", async () => {
    const { input, repository, logger, useCase } = setup()
    vi.mocked(repository.setNotificationStatus).mockRejectedValue(
      new Error("database busy")
    )
    await expect(useCase.execute(input, "request-1")).resolves.toMatchObject({
      leadId: "lead-1",
    })
    expect(logger.error).toHaveBeenCalledWith(
      "lead.notification_status_failed",
      expect.any(Object)
    )
  })

  it("does not notify if saving the lead fails", async () => {
    const send = vi.fn()
    const { input, repository, useCase } = setup([{ name: "test", send }])
    vi.mocked(repository.create).mockRejectedValue(new Error("disk full"))
    await expect(useCase.execute(input, "request-1")).rejects.toThrow(
      "disk full"
    )
    expect(send).not.toHaveBeenCalled()
  })
})

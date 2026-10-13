import { execFile } from "node:child_process"
import {
  copyFileSync,
  existsSync,
  mkdtempSync,
  rmdirSync,
  unlinkSync,
  writeFileSync,
} from "node:fs"
import { createRequire } from "node:module"
import { tmpdir } from "node:os"
import path from "node:path"
import { setTimeout as delay } from "node:timers/promises"
import { promisify } from "node:util"
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest"
import type { PrismaClient } from "@/generated/prisma/client"
import { createDatabaseClient } from "@/lib/db/create-client"
import { PrismaLeadRepository } from "../infrastructure/prisma-lead-repository"
import { SqliteRateLimiter } from "../infrastructure/sqlite-rate-limiter"
import { IdempotencyConflictError } from "../domain/ports"
import { createLeadSchema, consentVersion } from "../domain/schema"
import { validLead } from "./fixtures"
import { CreateLead } from "../application/create-lead"
import { createLeadHttpHandler } from "../infrastructure/http-handler"
import { createConfiguredNotifications } from "@/integrations/notifications/configured-notifications"
import { serverEnvSchema } from "@/lib/env/schema"

vi.mock("server-only", () => ({}))

let directory: string
let file: string
let database: PrismaClient
let templateDirectory: string
let templateFile: string

const prismaCli = createRequire(import.meta.url).resolve(
  "prisma/build/index.js"
)
const execFileAsync = promisify(execFile)

async function removeEmptyDirectory(directory: string) {
  // On Windows, a finished CLI's child process can briefly retain its cwd handle.
  for (let attempt = 0; ; attempt++) {
    try {
      rmdirSync(directory)
      return
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "EBUSY" || attempt >= 20)
        throw error
      await delay(100)
    }
  }
}

async function runPrisma(file: string, args: string[]) {
  try {
    return await execFileAsync(
      process.execPath,
      [prismaCli, "migrate", ...args],
      {
        cwd: process.cwd(),
        env: { ...process.env, NODE_ENV: "test", DATABASE_URL: `file:${file}` },
        timeout: 30_000,
      }
    )
  } catch (error) {
    const failure = error as Error & { stdout?: string; stderr?: string }
    throw new Error(
      `${failure.message}\n${failure.stdout ?? ""}\n${failure.stderr ?? ""}`,
      { cause: error }
    )
  }
}

beforeAll(async () => {
  templateDirectory = mkdtempSync(path.join(tmpdir(), "pulsarweb-migrations-"))
  templateFile = path.join(templateDirectory, "template.db")
  // Exercise the actual CLI and all migrations, not a hand-maintained SQL snapshot.
  await runPrisma(templateFile, ["deploy"])
}, 40_000)

afterAll(async () => {
  if (templateFile && existsSync(templateFile)) unlinkSync(templateFile)
  if (templateDirectory) await removeEmptyDirectory(templateDirectory)
})

beforeEach(() => {
  directory = mkdtempSync(path.join(tmpdir(), "pulsarweb-test-"))
  file = path.join(directory, "test.db")
  copyFileSync(templateFile, file)
  database = createDatabaseClient(`file:${file}`)
})

describe("SQLite migration lifecycle", () => {
  it("uses Next.js environment file precedence in development and production", async () => {
    const files = [
      ".env",
      ".env.local",
      ".env.production.local",
      "local.db",
      "production.db",
    ]
    writeFileSync(path.join(directory, ".env"), "DATABASE_URL=file:./base.db\n")
    writeFileSync(
      path.join(directory, ".env.local"),
      "DATABASE_URL=file:./local.db\n"
    )
    writeFileSync(
      path.join(directory, ".env.production.local"),
      "DATABASE_URL=file:./production.db\n"
    )
    const env = { ...process.env }
    delete env.DATABASE_URL
    delete env.__NEXT_PROCESSED_ENV
    try {
      for (const mode of ["development", "production"] as const) {
        await execFileAsync(
          process.execPath,
          [
            prismaCli,
            "migrate",
            "deploy",
            "--config",
            path.resolve("prisma.config.ts"),
          ],
          {
            cwd: directory,
            env: { ...env, NODE_ENV: mode },
            timeout: 30_000,
          }
        )
      }
      expect(existsSync(path.join(directory, "local.db"))).toBe(true)
      expect(existsSync(path.join(directory, "production.db"))).toBe(true)
      expect(existsSync(path.join(directory, "base.db"))).toBe(false)
    } finally {
      for (const name of [...files, "base.db"]) {
        const target = path.join(directory, name)
        if (existsSync(target)) unlinkSync(target)
      }
    }
  }, 70_000)

  it("deploys a schema matching the Prisma model", async () => {
    await runPrisma(file, [
      "diff",
      "--from-config-datasource",
      "--to-schema",
      "prisma/schema.prisma",
      "--exit-code",
    ])
  }, 40_000)

  it("preserves data and idempotency after disconnect and repeated deploy", async () => {
    const input = createLeadSchema.parse(validLead())
    const original = await new PrismaLeadRepository(database).create(
      input,
      consentVersion
    )
    await new SqliteRateLimiter(database, 1).consume("persisted-client")
    await database.$disconnect()

    await runPrisma(file, ["deploy"])
    database = createDatabaseClient(`file:${file}`)

    const replay = await new PrismaLeadRepository(database).create(
      input,
      consentVersion
    )
    expect(replay.created).toBe(false)
    expect(replay.lead.id).toBe(original.lead.id)
    expect(replay.lead.createdAt).toEqual(original.lead.createdAt)
    expect(
      (await new SqliteRateLimiter(database, 1).consume("persisted-client"))
        .allowed
    ).toBe(false)
    expect(await database.lead.count()).toBe(1)
  }, 40_000)

  it("rolls back a failed transaction through the driver adapter", async () => {
    await expect(
      database.$transaction(async (transaction) => {
        await transaction.rateLimitBucket.create({
          data: { key: "rolled-back", hits: 1, expiresAt: BigInt(Date.now()) },
        })
        throw new Error("abort transaction")
      })
    ).rejects.toThrow("abort transaction")
    expect(await database.rateLimitBucket.count()).toBe(0)
  })
})

afterEach(async () => {
  vi.unstubAllGlobals()
  await database.$disconnect()
  unlinkSync(file)
  await removeEmptyDirectory(directory)
})

describe("HTTP → SQLite → configured notification adapters", () => {
  it.each([
    [true, true, "sent"],
    [false, true, "partial"],
    [false, false, "failed"],
  ] as const)(
    "persists a lead before delivery and retains %s / %s → %s on replay",
    async (telegram, email, status) => {
      const input = validLead()
      const logger = { info: vi.fn(), warn: vi.fn(), error: vi.fn() }
      const deliverySnapshots: { url: string; status: string }[] = []
      const network = vi.fn(async (url: string | URL | Request) => {
        // Only the external network is stubbed; check durability at delivery time.
        const saved = await database.lead.findUniqueOrThrow({
          where: { submissionId: input.submissionId },
        })
        deliverySnapshots.push({
          url: String(url),
          status: saved.notificationStatus,
        })
        if (String(url).startsWith("https://api.telegram.org/")) {
          return telegram
            ? Response.json({ ok: true, result: { message_id: 1 } })
            : new Response("private Telegram failure", { status: 401 })
        }
        return email
          ? Response.json({ id: "test-email" })
          : new Response("private email failure", { status: 401 })
      })
      vi.stubGlobal("fetch", network)
      const env = serverEnvSchema.parse({
        SITE_URL: "https://studio.example",
        TELEGRAM_BOT_TOKEN: "123456:test_only_token",
        TELEGRAM_CHAT_ID: "-100123456789",
        RESEND_API_KEY: "re_test_only_key",
        EMAIL_FROM: "studio@example.com",
        LEAD_NOTIFICATION_EMAIL: "owner@example.com",
      })
      const handler = createLeadHttpHandler({
        createLead: new CreateLead(
          new PrismaLeadRepository(database),
          createConfiguredNotifications(env, logger),
          logger
        ),
        rateLimiter: new SqliteRateLimiter(database),
        globalRateLimiter: new SqliteRateLimiter(database, 200),
        siteUrl: env.SITE_URL,
        trustProxy: false,
        logger,
      })
      const post = () =>
        handler(
          new Request("https://studio.example/api/leads", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Origin: env.SITE_URL,
            },
            body: JSON.stringify(input),
          })
        )
      const created = await post()
      expect(created.status).toBe(201)
      const result = await created.json()
      expect(network).toHaveBeenCalledTimes(2)
      expect(deliverySnapshots).toEqual(
        expect.arrayContaining([
          {
            url: `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`,
            status: "pending",
          },
          { url: "https://api.resend.com/emails", status: "pending" },
        ])
      )
      await database.$disconnect()
      const replay = await post()
      expect(replay.status).toBe(200)
      expect(await replay.json()).toEqual(result)
      expect(network).toHaveBeenCalledTimes(2)
      expect(await database.lead.count()).toBe(1)
      const saved = await database.lead.findUniqueOrThrow({
        where: { id: result.leadId },
      })
      expect(saved).toMatchObject({
        email: input.email,
        message: input.message,
        notificationStatus: status,
        consentVersion,
      })
      const diagnostics = JSON.stringify([
        logger.info.mock.calls,
        logger.warn.mock.calls,
        logger.error.mock.calls,
      ])
      for (const privateValue of [
        input.email!,
        input.message,
        env.TELEGRAM_BOT_TOKEN!,
        env.RESEND_API_KEY!,
        "private Telegram failure",
        "private email failure",
      ]) {
        expect(diagnostics).not.toContain(privateValue)
      }
    }
  )
})

describe("SQLite lead repository", () => {
  it.each([
    [true, true, "sent"],
    [false, true, "partial"],
    [false, false, "failed"],
  ] as const)(
    "retains the actual lead and notification outcome: %s / %s → %s",
    async (telegram, email, status) => {
      const repository = new PrismaLeadRepository(database)
      const useCase = new CreateLead(
        repository,
        [
          {
            name: "telegram",
            send: async () => {
              if (!telegram) throw new Error("provider offline")
            },
          },
          {
            name: "email",
            send: async () => {
              if (!email) throw new Error("provider offline")
            },
          },
        ],
        { info() {}, warn() {}, error() {} }
      )
      const result = await useCase.execute(
        validLead(),
        "notification-integration-test"
      )
      expect(result.created).toBe(true)
      const row = await database.lead.findUniqueOrThrow({
        where: { id: result.leadId },
      })
      expect(row.notificationStatus).toBe(status)
      expect(row.message).toBeTruthy()
    }
  )

  it("persists complete lead and consent metadata using the committed migration", async () => {
    const input = createLeadSchema.parse(
      validLead({ telegram: "@test_client" })
    )
    const result = await new PrismaLeadRepository(database).create(
      input,
      consentVersion
    )
    const row = await database.lead.findUniqueOrThrow({
      where: { id: result.lead.id },
    })
    expect(row.email).toBe(input.email)
    expect(row.telegram).toBe("@test_client")
    expect(row.consentVersion).toBe(consentVersion)
    expect(row.consentAt).toBeInstanceOf(Date)
    expect(row.notificationStatus).toBe("pending")
  })

  it("deduplicates simultaneous requests and retries with a new repository instance", async () => {
    const input = createLeadSchema.parse(validLead())
    const repository = new PrismaLeadRepository(database)
    const results = await Promise.all([
      repository.create(input, consentVersion),
      repository.create(input, consentVersion),
    ])
    expect(results.filter((result) => result.created)).toHaveLength(1)
    const replay = await new PrismaLeadRepository(database).create(
      input,
      consentVersion
    )
    expect(replay.created).toBe(false)
    expect(replay.lead.id).toBe(results[0].lead.id)
    expect(await database.lead.count()).toBe(1)
  })

  it("rejects reuse of a submission identifier with different data", async () => {
    const input = createLeadSchema.parse(validLead())
    const repository = new PrismaLeadRepository(database)
    await repository.create(input, consentVersion)
    await expect(
      repository.create(
        { ...input, message: "A different project request" },
        consentVersion
      )
    ).rejects.toBeInstanceOf(IdempotencyConflictError)
    expect(await database.lead.count()).toBe(1)
  })

  it("persists the result of a notification attempt", async () => {
    const repository = new PrismaLeadRepository(database)
    const { lead } = await repository.create(
      createLeadSchema.parse(validLead()),
      consentVersion
    )
    await repository.setNotificationStatus(lead.id, "failed")
    expect(
      (await database.lead.findUniqueOrThrow({ where: { id: lead.id } }))
        .notificationStatus
    ).toBe("failed")
  })
})

describe("SQLite rate limiter", () => {
  it("enforces the limit across instances, then resets after expiry", async () => {
    let now = 100_000
    const limiter = new SqliteRateLimiter(database, 2, 60_000, () => now)
    expect((await limiter.consume("client-a")).allowed).toBe(true)
    expect((await limiter.consume("client-a")).allowed).toBe(true)
    expect(
      (
        await new SqliteRateLimiter(database, 2, 60_000, () => now).consume(
          "client-a"
        )
      ).allowed
    ).toBe(false)
    expect((await limiter.consume("client-b")).allowed).toBe(true)
    now += 60_001
    expect((await limiter.consume("client-a")).allowed).toBe(true)
    expect(await database.rateLimitBucket.count()).toBe(1)
  })

  it("allows only the configured number of concurrent requests", async () => {
    const limiter = new SqliteRateLimiter(database, 3)
    const results = await Promise.all(
      Array.from({ length: 8 }, () => limiter.consume("concurrent"))
    )
    expect(results.filter((result) => result.allowed)).toHaveLength(3)
  })
})

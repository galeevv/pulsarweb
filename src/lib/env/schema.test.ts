import { describe, expect, it } from "vitest"
import { serverEnvSchema } from "./schema"
import { resolveDatabaseUrl } from "./database-url"

describe("server environment", () => {
  it("starts with all integrations absent", () => {
    expect(serverEnvSchema.parse({}).RESEND_API_KEY).toBeUndefined()
    expect(serverEnvSchema.parse({}).TRUST_PROXY).toBe(false)
  })
  it("keeps the core application available with partial optional provider configuration", () => {
    expect(
      serverEnvSchema.safeParse({ TELEGRAM_BOT_TOKEN: "token" }).success
    ).toBe(true)
    expect(serverEnvSchema.safeParse({ RESEND_API_KEY: "key" }).success).toBe(
      true
    )
  })
  it("does not treat arbitrary strings as booleans or unsafe protocols as site URLs", () => {
    expect(serverEnvSchema.safeParse({ TRUST_PROXY: "yes" }).success).toBe(
      false
    )
    expect(
      serverEnvSchema.safeParse({ SITE_URL: "javascript:alert(1)" }).success
    ).toBe(false)
  })
  it("resolves the same SQLite path for CLI and runtime", () => {
    expect(resolveDatabaseUrl()).toMatch(/^file:.*\/prisma\/pulsarweb\.db$/)
    expect(resolveDatabaseUrl("file:./prisma/pulsarweb.db")).toBe(
      resolveDatabaseUrl()
    )
    expect(() => resolveDatabaseUrl("postgres://unsupported")).toThrow()
  })

  it.each([
    "not a URL",
    "https://user:password@studio.example",
    "https://studio.example/subdirectory",
    "https://studio.example?preview=true",
    "https://studio.example/#section",
    "ftp://studio.example",
  ])(
    "rejects ambiguous site origin %s without throwing outside Zod",
    (SITE_URL) => {
      expect(serverEnvSchema.safeParse({ SITE_URL }).success).toBe(false)
    }
  )

  it("normalizes the site origin for canonical links and origin checks", () => {
    expect(
      serverEnvSchema.parse({ SITE_URL: "https://studio.example/" }).SITE_URL
    ).toBe("https://studio.example")
    expect(
      serverEnvSchema.parse({ SITE_URL: "http://localhost:3100" }).SITE_URL
    ).toBe("http://localhost:3100")
  })
})

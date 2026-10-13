import { describe, expect, it, vi } from "vitest"
import { serverEnvSchema } from "@/lib/env/schema"
import { resolveNotificationConfig } from "@/lib/env/notifications"
import { createConfiguredNotifications } from "./configured-notifications"

vi.mock("server-only", () => ({}))

const telegram = {
  TELEGRAM_BOT_TOKEN: "123456:fake_test_token",
  TELEGRAM_CHAT_ID: "-100123456789",
}
const email = {
  RESEND_API_KEY: "re_fake_test_key",
  EMAIL_FROM: "studio@example.com",
  LEAD_NOTIFICATION_EMAIL: "owner@example.com",
}

describe("optional notification configuration", () => {
  it("starts without providers or warnings when configuration is absent or blank", () => {
    const logger = { info: vi.fn(), warn: vi.fn(), error: vi.fn() }
    const env = serverEnvSchema.parse({
      RESEND_API_KEY: "  ",
      TELEGRAM_CHAT_ID: "",
    })
    expect(createConfiguredNotifications(env, logger)).toEqual([])
    expect(logger.warn).not.toHaveBeenCalled()
  })

  it.each([
    [{ ...telegram }, ["telegram"]],
    [{ ...email }, ["email"]],
    [{ ...telegram, ...email }, ["telegram", "email"]],
  ])("enables independently configured channels", (config, expected) => {
    const logger = { info: vi.fn(), warn: vi.fn(), error: vi.fn() }
    const notifications = createConfiguredNotifications(
      serverEnvSchema.parse(config),
      logger
    )
    expect(notifications.map((notification) => notification.name)).toEqual(
      expected
    )
    expect(logger.warn).not.toHaveBeenCalled()
  })

  it.each([
    { TELEGRAM_BOT_TOKEN: "123456:secret" },
    { TELEGRAM_CHAT_ID: "-100123" },
    { ...telegram, TELEGRAM_BOT_TOKEN: "secret/path?query" },
    { ...telegram, TELEGRAM_CHAT_ID: "invalid chat" },
    { RESEND_API_KEY: "re_secret" },
    { EMAIL_FROM: "studio@example.com" },
    { ...email, EMAIL_FROM: "malformed" },
    { ...email, LEAD_NOTIFICATION_EMAIL: "invalid\nrecipient" },
  ])(
    "disables invalid channels without exposing configuration values",
    (config) => {
      const logger = { info: vi.fn(), warn: vi.fn(), error: vi.fn() }
      expect(
        createConfiguredNotifications(serverEnvSchema.parse(config), logger)
      ).toEqual([])
      expect(logger.warn).toHaveBeenCalledWith(
        "notification.configuration_invalid",
        {
          provider: expect.any(String),
          fields: expect.any(String),
        }
      )
      const logs = JSON.stringify(logger.warn.mock.calls)
      for (const value of Object.values(config))
        expect(logs).not.toContain(value)
    }
  )

  it("retains the healthy channel when another is only partially configured", () => {
    const logger = { info: vi.fn(), warn: vi.fn(), error: vi.fn() }
    const env = serverEnvSchema.parse({
      ...email,
      TELEGRAM_BOT_TOKEN: "123456:secret",
    })
    expect(
      createConfiguredNotifications(env, logger).map(
        (notification) => notification.name
      )
    ).toEqual(["email"])
    expect(resolveNotificationConfig(env).telegram.state).toBe("invalid")
  })
})

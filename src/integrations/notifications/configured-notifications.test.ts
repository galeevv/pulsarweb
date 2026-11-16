import { describe, expect, it, vi } from "vitest"
import { serverEnvSchema } from "@/lib/env/schema"
import { createConfiguredNotifications } from "./configured-notifications"

vi.mock("server-only", () => ({}))

const telegram = {
  TELEGRAM_BOT_TOKEN: "123456:fake_test_token",
  TELEGRAM_CHAT_ID: "-100123456789",
}
describe("optional notification configuration", () => {
  it("starts without providers or warnings when configuration is absent or blank", () => {
    const logger = { info: vi.fn(), warn: vi.fn(), error: vi.fn() }
    const env = serverEnvSchema.parse({
      TELEGRAM_BOT_TOKEN: "  ",
      TELEGRAM_CHAT_ID: "",
    })
    expect(createConfiguredNotifications(env, logger)).toEqual([])
    expect(logger.warn).not.toHaveBeenCalled()
  })

  it.each([
    [{ ...telegram }, ["telegram"]],
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

})

import { spawnSync } from "node:child_process"
import { existsSync, mkdtempSync, rmdirSync, unlinkSync } from "node:fs"
import { createRequire } from "node:module"
import { tmpdir } from "node:os"
import path from "node:path"
import { setTimeout as delay } from "node:timers/promises"

const require = createRequire(import.meta.url)
const directory = mkdtempSync(path.join(tmpdir(), "pulsarweb-e2e-"))
const database = path.join(directory, "test.db")
const partialIntegrations = process.argv.includes("--partial-integrations")
const playwrightArgs = process.argv
  .slice(2)
  .filter((arg) => arg !== "--partial-integrations")
const env = {
  ...process.env,
  NODE_ENV: "production",
  DATABASE_URL: `file:${database.replaceAll("\\", "/")}`,
  PULSAR_E2E_DATABASE_PATH: database,
  SITE_URL: "http://127.0.0.1:3100",
  TRUST_PROXY: "false",
  TELEGRAM_BOT_TOKEN: partialIntegrations ? "123456:test_only_token" : "",
  TELEGRAM_CHAT_ID: "",
  RESEND_API_KEY: partialIntegrations ? "re_test_only_key" : "",
  EMAIL_FROM: "",
  LEAD_NOTIFICATION_EMAIL: "",
}

function run(module, args) {
  const result = spawnSync(
    process.execPath,
    [require.resolve(module), ...args],
    {
      env,
      stdio: "inherit",
    }
  )
  if (result.error) throw result.error
  return result.status ?? 1
}

try {
  // Static metadata and runtime origin checks must use the same test origin.
  // Provider credentials are isolated during the build as well as the server run.
  for (const [module, args] of [
    ["prisma/build/index.js", ["generate"]],
    ["next/dist/bin/next", ["build"]],
    ["prisma/build/index.js", ["migrate", "deploy"]],
    ["@playwright/test/cli", ["test", ...playwrightArgs]],
  ]) {
    process.exitCode = run(module, args)
    if (process.exitCode !== 0) break
  }
} finally {
  // Remove only files belonging to this freshly created test database.
  for (let attempt = 0; ; attempt++) {
    try {
      for (const suffix of ["", "-journal", "-shm", "-wal"]) {
        if (existsSync(database + suffix)) unlinkSync(database + suffix)
      }
      rmdirSync(directory)
      break
    } catch (error) {
      if (!["EBUSY", "EPERM"].includes(error.code) || attempt >= 20) throw error
      await delay(100)
    }
  }
}

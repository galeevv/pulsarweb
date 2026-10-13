import path from "node:path"
import Database from "better-sqlite3"
import { test as base, expect } from "@playwright/test"

export const test = base.extend<{ database: Database.Database }>({
  database: [
    async ({ baseURL }, provideDatabase) => {
      const file = process.env.PULSAR_E2E_DATABASE_PATH
      if (
        baseURL !== "http://127.0.0.1:3100" ||
        !file ||
        !path.basename(path.dirname(file)).startsWith("pulsarweb-e2e-")
      ) {
        throw new Error("Run pnpm test:e2e to provision an isolated database")
      }
      const database = new Database(file, { fileMustExist: true })
      database.exec('DELETE FROM "Lead"; DELETE FROM "RateLimitBucket";')
      try {
        await provideDatabase(database)
      } finally {
        database.close()
      }
    },
    { auto: true },
  ],
})

export { expect }

import path from "node:path"
import { describe, expect, it } from "vitest"
import { databaseUrlSchema, resolveDatabaseUrl } from "./database-url"

describe("SQLite database URL", () => {
  it("resolves the default and relative paths from the project working directory", () => {
    expect(resolveDatabaseUrl()).toBe(
      `file:${path.resolve("prisma/pulsarweb.db").replaceAll("\\", "/")}`
    )
    expect(resolveDatabaseUrl("file:./data/заявки студии.db")).toBe(
      `file:${path.resolve("data/заявки студии.db").replaceAll("\\", "/")}`
    )
  })

  it("preserves an absolute filesystem path", () => {
    const file = path.resolve("data/production.db")
    expect(resolveDatabaseUrl(`file:${file}`)).toBe(
      `file:${file.replaceAll("\\", "/")}`
    )
  })

  it.each([
    "",
    "postgresql://localhost/app",
    "file:",
    "file:  ",
    "file::memory:",
    "file://host/db",
    "file:./db?mode=ro",
    "file:./db#fragment",
    "file:./encoded%20name.db",
  ])("rejects an unsupported URL: %s", (url) => {
    expect(databaseUrlSchema.safeParse(url).success).toBe(false)
  })
})

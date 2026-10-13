import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3"
import { PrismaClient } from "@/generated/prisma/client"
import { resolveDatabaseUrl } from "@/lib/env/database-url"

// Infrastructure only. Callers own the connection and must disconnect on shutdown.
// The Next.js server uses the lazy singleton in client.ts.
export function createDatabaseClient(url: string): PrismaClient {
  const adapter = new PrismaBetterSqlite3(
    { url: resolveDatabaseUrl(url), timeout: 5_000 },
    { timestampFormat: "iso8601" }
  )
  return new PrismaClient({ adapter })
}

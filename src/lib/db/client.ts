import "server-only"
import type { PrismaClient } from "@/generated/prisma/client"
import { getServerEnv } from "@/lib/env/server"
import { createDatabaseClient } from "./create-client"

const globalDatabase = globalThis as unknown as { pulsarPrisma?: PrismaClient }

export function getDatabase(): PrismaClient {
  if (!globalDatabase.pulsarPrisma) {
    globalDatabase.pulsarPrisma = createDatabaseClient(
      getServerEnv().DATABASE_URL
    )
  }
  return globalDatabase.pulsarPrisma
}

export async function checkDatabase(): Promise<void> {
  // Checks the required schema as well as the connection, without reading lead data.
  await getDatabase().lead.findFirst({
    select: { id: true },
    where: { id: "__health__" },
  })
}

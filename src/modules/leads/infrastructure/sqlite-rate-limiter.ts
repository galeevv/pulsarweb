import type { PrismaClient } from "@/generated/prisma/client"
import type { RateLimiter } from "../domain/ports"

export class SqliteRateLimiter implements RateLimiter {
  private lastCleanup = 0

  constructor(
    private readonly database: PrismaClient,
    private readonly limit = 5,
    private readonly windowMs = 10 * 60_000,
    private readonly now = Date.now
  ) {}

  async consume(key: string) {
    const now = this.now()
    if (now - this.lastCleanup >= 60_000) {
      await this.database.rateLimitBucket.deleteMany({
        where: { expiresAt: { lte: BigInt(now) } },
      })
      this.lastCleanup = now
    }

    // Atomic upsert avoids read-then-write races and keeps limits across restarts.
    // This SQLite-specific detail belongs to the adapter, never the use case.
    const [bucket] = await this.database.$queryRaw<
      { hits: number; expiresAt: bigint }[]
    >`
      INSERT INTO "RateLimitBucket" ("key", "hits", "expiresAt")
      VALUES (${key}, 1, ${BigInt(now + this.windowMs)})
      ON CONFLICT("key") DO UPDATE SET
        "hits" = CASE WHEN "expiresAt" <= ${BigInt(now)} THEN 1 ELSE "hits" + 1 END,
        "expiresAt" = CASE WHEN "expiresAt" <= ${BigInt(now)} THEN ${BigInt(now + this.windowMs)} ELSE "expiresAt" END
      RETURNING "hits", "expiresAt"
    `
    return {
      allowed: bucket.hits <= this.limit,
      retryAfterSeconds: Math.max(
        1,
        Math.ceil((Number(bucket.expiresAt) - now) / 1000)
      ),
    }
  }
}

import { checkDatabase } from "@/lib/db/client"
import { logger } from "@/lib/logger"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(): Promise<Response> {
  try {
    await checkDatabase()
    return Response.json(
      { status: "ok" },
      { headers: { "Cache-Control": "no-store" } }
    )
  } catch {
    logger.error("health.database_unavailable")
    return Response.json(
      { status: "unavailable" },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    )
  }
}

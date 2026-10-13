import { randomUUID } from "node:crypto"
import { getLeadHandler } from "@/modules/leads/server"
import { logger } from "@/lib/logger"

export const runtime = "nodejs"

export async function POST(request: Request): Promise<Response> {
  try {
    return await getLeadHandler()(request)
  } catch {
    const requestId = randomUUID()
    logger.error("lead.configuration_failed", { requestId })
    return Response.json(
      {
        ok: false,
        error: {
          code: "UNAVAILABLE",
          message: "Форма временно недоступна. Попробуйте позже.",
        },
        requestId,
      },
      {
        status: 503,
        headers: { "Cache-Control": "no-store", "X-Request-Id": requestId },
      }
    )
  }
}

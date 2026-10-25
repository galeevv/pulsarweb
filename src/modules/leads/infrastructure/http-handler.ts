import { createHash, randomUUID } from "node:crypto"
import { isIP } from "node:net"
import { z } from "zod"
import {
  IdempotencyConflictError,
  SpamSubmissionError,
  type RateLimiter,
} from "../domain/ports"
import type { CreateLead } from "../application/create-lead"
import type { LeadApiResponse } from "../contracts"
import type { Logger } from "@/lib/logger"

interface Dependencies {
  createLead: Pick<CreateLead, "execute">
  rateLimiter: RateLimiter
  globalRateLimiter: RateLimiter
  siteUrl: string
  trustProxy: boolean
  logger: Logger
}

class InvalidBodyError extends Error {
  constructor(readonly status: number) {
    super("Invalid body")
  }
}

async function readJson(request: Request): Promise<unknown> {
  const maxBytes = 32_768
  if (Number(request.headers.get("content-length")) > maxBytes)
    throw new InvalidBodyError(413)
  if (!request.body) throw new InvalidBodyError(400)
  const reader = request.body.getReader()
  const chunks: Uint8Array[] = []
  let size = 0
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      size += value.byteLength
      if (size > maxBytes) {
        await reader.cancel()
        throw new InvalidBodyError(413)
      }
      chunks.push(value)
    }
  } finally {
    reader.releaseLock()
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"))
  } catch {
    throw new InvalidBodyError(400)
  }
}

export function createLeadHttpHandler(dependencies: Dependencies) {
  return async (request: Request): Promise<Response> => {
    const requestId = randomUUID()
    const headers = { "Cache-Control": "no-store", "X-Request-Id": requestId }
    const fail = (
      status: number,
      code: string,
      message: string,
      fieldErrors?: Record<string, string[]>,
      extraHeaders = {}
    ) =>
      Response.json(
        {
          ok: false,
          error: { code, message, ...(fieldErrors && { fieldErrors }) },
          requestId,
        } satisfies LeadApiResponse,
        { status, headers: { ...headers, ...extraHeaders } }
      )

    try {
      const origin = request.headers.get("origin")
      if (origin && origin !== new URL(dependencies.siteUrl).origin)
        return fail(
          403,
          "ORIGIN_REJECTED",
          "Отправьте заявку с сайта PulsarWeb."
        )
      if (
        request.headers
          .get("content-type")
          ?.split(";")[0]
          .trim()
          .toLowerCase() !== "application/json"
      )
        return fail(415, "UNSUPPORTED_MEDIA_TYPE", "Ожидается JSON.")

      const globalLimit =
        await dependencies.globalRateLimiter.consume("leads:global")
      if (!globalLimit.allowed)
        return fail(
          429,
          "RATE_LIMITED",
          "Слишком много заявок. Попробуйте чуть позже.",
          undefined,
          { "Retry-After": String(globalLimit.retryAfterSeconds) }
        )

      // Accept only a single IP from a proxy explicitly configured to overwrite this header.
      const forwarded = dependencies.trustProxy
        ? request.headers.get("x-real-ip")?.trim()
        : undefined
      const identity = forwarded && isIP(forwarded) ? forwarded : "anonymous"
      const key = createHash("sha256").update(`leads:${identity}`).digest("hex")
      const limit = await dependencies.rateLimiter.consume(key)
      if (!limit.allowed)
        return fail(
          429,
          "RATE_LIMITED",
          "Вы уже отправили несколько заявок. Попробуйте через 10 минут.",
          undefined,
          { "Retry-After": String(limit.retryAfterSeconds) }
        )

      const result = await dependencies.createLead.execute(
        await readJson(request),
        requestId
      )
      return Response.json(
        {
          ok: true,
          leadId: result.leadId,
          publicId: result.publicId,
        } satisfies LeadApiResponse,
        { status: result.created ? 201 : 200, headers }
      )
    } catch (error) {
      if (error instanceof z.ZodError)
        return fail(
          422,
          "VALIDATION_ERROR",
          "Проверьте заполненные поля.",
          z.flattenError(error).fieldErrors
        )
      if (error instanceof SpamSubmissionError)
        return fail(
          400,
          "SUBMISSION_REJECTED",
          "Не удалось отправить заявку. Обновите страницу."
        )
      if (error instanceof IdempotencyConflictError)
        return fail(
          409,
          "SUBMISSION_CONFLICT",
          "Эта заявка уже отправлена. Обновите страницу для новой заявки."
        )
      if (error instanceof InvalidBodyError)
        return fail(
          error.status,
          "INVALID_BODY",
          error.status === 413
            ? "Размер заявки слишком большой."
            : "Некорректный запрос."
        )
      dependencies.logger.error("lead.request_failed", { requestId })
      return fail(
        503,
        "UNAVAILABLE",
        "Не удалось сохранить заявку. Попробуйте ещё раз — данные останутся в форме."
      )
    }
  }
}

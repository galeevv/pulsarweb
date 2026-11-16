import "server-only"
import type { z } from "zod"
import { NotificationDeliveryError } from "@/modules/leads/domain/ports"

// Telegram has no idempotency key: do not retry ambiguous delivery failures.
// One deadline covers both the request and reading the response body.
export async function requestProviderJson<T>(
  url: string,
  init: RequestInit,
  schema: z.ZodType<T>
): Promise<T> {
  const signal = AbortSignal.timeout(8_000)
  try {
    const response = await fetch(url, {
      ...init, signal, cache: "no-store", redirect: "error",
    })
    if (!response.ok) {
      await response.body?.cancel()
      throw new NotificationDeliveryError("http", response.status)
    }
    let json: unknown
    try {
      json = await response.json()
    } catch {
      throw new NotificationDeliveryError(signal.aborted ? "timeout" : "invalid-response")
    }
    const result = schema.safeParse(json)
    if (!result.success) throw new NotificationDeliveryError("invalid-response")
    return result.data
  } catch (error) {
    throw error instanceof NotificationDeliveryError
      ? error
      : new NotificationDeliveryError(signal.aborted ? "timeout" : "network")
  }
}

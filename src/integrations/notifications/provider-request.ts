import "server-only"
import { setTimeout as delay } from "node:timers/promises"
import type { z } from "zod"
import { NotificationDeliveryError } from "@/modules/leads/domain/ports"

// One deadline covers requests, body reads and optional backoff.
// Only providers with idempotency support may retry ambiguous failures.
export async function requestProviderJson<T>(
  url: string,
  init: RequestInit,
  schema: z.ZodType<T>,
  retrySafe = false
): Promise<T> {
  const signal = AbortSignal.timeout(8_000)
  for (let attempt = 0; attempt < (retrySafe ? 2 : 1); attempt++) {
    let retryDelay = 300
    try {
      const response = await fetch(url, {
        ...init,
        signal,
        cache: "no-store",
        redirect: "error",
      })
      if (!response.ok) {
        const retryAfter = response.headers.get("retry-after")
        if (retryAfter) {
          const seconds = Number(retryAfter)
          const milliseconds = Number.isFinite(seconds)
            ? seconds * 1000
            : Date.parse(retryAfter) - Date.now()
          if (Number.isFinite(milliseconds))
            retryDelay = Math.max(0, milliseconds)
        }
        await response.body?.cancel()
        throw new NotificationDeliveryError("http", response.status)
      }
      let json: unknown
      try {
        json = await response.json()
      } catch {
        throw new NotificationDeliveryError(
          signal.aborted ? "timeout" : "invalid-response"
        )
      }
      const result = schema.safeParse(json)
      if (!result.success)
        throw new NotificationDeliveryError("invalid-response")
      return result.data
    } catch (error) {
      const failure =
        error instanceof NotificationDeliveryError
          ? error
          : new NotificationDeliveryError(
              signal.aborted ? "timeout" : "network"
            )
      const transient =
        failure.code === "network" ||
        (failure.code === "http" &&
          (failure.status === 429 || (failure.status ?? 0) >= 500))
      if (
        !retrySafe ||
        attempt > 0 ||
        !transient ||
        signal.aborted ||
        retryDelay > 1000
      )
        throw failure
      try {
        await delay(retryDelay, undefined, { signal })
      } catch {
        throw new NotificationDeliveryError("timeout")
      }
    }
  }
  throw new NotificationDeliveryError("network")
}

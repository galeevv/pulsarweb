import { z } from "zod"

export const attributionStorageKey = "pulsarweb:first-touch:v1"
const text = z.string().trim().max(200).optional()
const path = z
  .string()
  .max(2048)
  .refine((value) => value.startsWith("/") && !value.startsWith("//"))
const attributionSchema = z.object({
  landingPage: path,
  referrer: z
    .string()
    .max(2048)
    .refine((value) => {
      try {
        const url = new URL(value)
        return (
          ["http:", "https:"].includes(url.protocol) &&
          !url.username &&
          !url.password
        )
      } catch {
        return false
      }
    })
    .optional(),
  utmSource: text,
  utmMedium: text,
  utmCampaign: text,
  utmContent: text,
  utmTerm: text,
})
export type Attribution = z.infer<typeof attributionSchema>
let memory: Attribution | undefined

export function captureAttribution(
  href: string,
  referrer: string
): Attribution {
  const url = new URL(href)
  const utm = (key: string) =>
    url.searchParams.get(key)?.trim().slice(0, 200) || undefined
  let referringPage: string | undefined
  try {
    const parsed = new URL(referrer)
    if (
      ["http:", "https:"].includes(parsed.protocol) &&
      !parsed.username &&
      !parsed.password
    ) {
      // Keep the referring page, but not arbitrary query/fragment data.
      referringPage = `${parsed.origin}${parsed.pathname}`.slice(0, 2048)
    }
  } catch {
    /* Direct entry has no referrer. */
  }
  return {
    landingPage: url.pathname.slice(0, 2048),
    referrer: referringPage,
    utmSource: utm("utm_source"),
    utmMedium: utm("utm_medium"),
    utmCampaign: utm("utm_campaign"),
    utmContent: utm("utm_content"),
    utmTerm: utm("utm_term"),
  }
}

export function clearFirstTouchAttribution() {
  memory = undefined
  try {
    window.sessionStorage.removeItem(attributionStorageKey)
  } catch {
    // The browser may deny access to storage.
  }
}

// First touch is immutable for this tab's session, including direct visits.
// Storage restrictions must never prevent a visitor from submitting a lead.
export function getFirstTouchAttribution(): Attribution | undefined {
  if (typeof window === "undefined") return undefined
  if (memory) return memory
  try {
    const stored = window.sessionStorage.getItem(attributionStorageKey)
    if (stored) {
      const parsed = attributionSchema.safeParse(JSON.parse(stored))
      if (parsed.success) return (memory = parsed.data)
    }
  } catch {
    /* Fall back to memory when storage is unavailable or corrupt. */
  }
  memory = captureAttribution(window.location.href, document.referrer)
  try {
    window.sessionStorage.setItem(attributionStorageKey, JSON.stringify(memory))
  } catch {
    /* Internal client navigation still retains the in-memory snapshot. */
  }
  return memory
}

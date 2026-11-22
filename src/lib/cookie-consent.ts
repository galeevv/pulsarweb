export type CookieConsentChoice = "accepted" | "declined"

const storageKey = "pulsarweb:cookie-consent:v1"
const changeEvent = "pulsarweb:cookie-consent"
let fallbackChoice: CookieConsentChoice | undefined

export function getCookieConsent(): CookieConsentChoice | null {
  if (typeof window === "undefined") return null
  if (fallbackChoice) return fallbackChoice

  try {
    const value = window.localStorage.getItem(storageKey)
    return value === "accepted" || value === "declined" ? value : null
  } catch {
    return null
  }
}

export function setCookieConsent(choice: CookieConsentChoice) {
  try {
    window.localStorage.setItem(storageKey, choice)
    fallbackChoice = undefined
  } catch {
    fallbackChoice = choice
  }
  window.dispatchEvent(new Event(changeEvent))
}

export function subscribeToCookieConsent(onChange: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === storageKey || event.key === null) onChange()
  }

  window.addEventListener(changeEvent, onChange)
  window.addEventListener("storage", onStorage)
  return () => {
    window.removeEventListener(changeEvent, onChange)
    window.removeEventListener("storage", onStorage)
  }
}

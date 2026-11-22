"use client"

import Link from "next/link"
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  getCookieConsent,
  setCookieConsent,
  subscribeToCookieConsent,
  type CookieConsentChoice,
} from "@/lib/cookie-consent"

const CookieSettings = createContext<(trigger: HTMLButtonElement) => void>(
  () => {}
)
const getServerConsent = () => undefined

export function CookieSettingsButton() {
  const openSettings = useContext(CookieSettings)

  return (
    <button
      type="button"
      onClick={(event) => openSettings(event.currentTarget)}
      className="inline-flex min-h-11 cursor-pointer items-center rounded-sm text-left hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
    >
      Настройки cookie
    </button>
  )
}

export function CookieConsentBanner({ children }: { children: ReactNode }) {
  const choice = useSyncExternalStore<CookieConsentChoice | null | undefined>(
    subscribeToCookieConsent,
    getCookieConsent,
    getServerConsent
  )
  const [trigger, setTrigger] = useState<HTMLButtonElement | null>(null)
  const declineButton = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (trigger) declineButton.current?.focus()
  }, [trigger])

  function save(nextChoice: CookieConsentChoice) {
    setCookieConsent(nextChoice)
    setTrigger(null)
    trigger?.focus()
  }

  return (
    <CookieSettings.Provider value={setTrigger}>
      {children}
      {(choice === null || trigger) && (
        <section
          aria-labelledby="cookie-consent-title"
          onKeyDown={(event) => {
            if (event.key === "Escape" && trigger) {
              setTrigger(null)
              trigger.focus()
            }
          }}
          className="fixed inset-x-3 bottom-[calc(0.75rem+env(safe-area-inset-bottom,0px))] z-[45] mx-auto max-h-[calc(100dvh-1.5rem)] max-w-2xl overflow-y-auto rounded-3xl shadow-2xl shadow-black/35 sm:inset-x-5 sm:bottom-[calc(1.25rem+env(safe-area-inset-bottom,0px))]"
        >
          <Card
            className="marketing-surface border border-border ring-0"
            size="sm"
          >
            <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
              <div className="flex min-w-0 flex-col gap-1">
                <h2
                  id="cookie-consent-title"
                  className="text-base font-medium tracking-tight"
                >
                  Настройки cookie
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Мы используем файлы cookie, чтобы улучшить работу сайта.{" "}
                  <Link
                    href="/legal/cookies"
                    className="rounded-sm text-foreground underline decoration-border underline-offset-4 hover:decoration-current focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                  >
                    Подробнее
                  </Link>
                </p>
              </div>
              <div className="grid shrink-0 grid-cols-2 gap-2 sm:flex">
                <Button
                  ref={declineButton}
                  type="button"
                  variant="outline"
                  className="min-h-11 px-4"
                  onClick={() => save("declined")}
                >
                  Отклонить
                </Button>
                <Button
                  type="button"
                  className="min-h-11 px-4"
                  onClick={() => save("accepted")}
                >
                  Принять
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      )}
    </CookieSettings.Provider>
  )
}

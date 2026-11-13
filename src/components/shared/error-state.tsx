"use client"

import { ArrowLeft, RotateCcw } from "lucide-react"
import { useEffect, useRef, useTransition } from "react"
import { PulsarMark } from "@/components/shared/logo"
import { Button } from "@/components/ui/button"
import { ButtonLink } from "@/components/shared/button-link"
import { Spinner } from "@/components/ui/spinner"

export function ErrorState({ retry }: { retry: () => void }) {
  const headingRef = useRef<HTMLHeadingElement>(null)
  const [pending, startTransition] = useTransition()
  useEffect(() => {
    headingRef.current?.focus()
  }, [])
  return (
    <section
      className="error-page relative isolate m-2 flex min-h-[calc(100dvh-1rem)] flex-col items-center justify-center rounded-3xl border border-border px-6 py-16 text-center"
      aria-labelledby="error-title"
    >
      <PulsarMark className="mb-6 size-16" />
      <h1
        id="error-title"
        ref={headingRef}
        tabIndex={-1}
        className="max-w-4xl text-4xl font-medium tracking-tight text-balance outline-none sm:text-6xl"
      >
        Не удалось открыть страницу
      </h1>
      <p className="mt-6 max-w-lg leading-relaxed text-muted-foreground">
        Попробуйте ещё раз или вернитесь на главную.
      </p>
      <div className="mt-8 flex w-full max-w-sm flex-col gap-3 sm:max-w-none sm:w-auto sm:flex-row">
        <Button
          onClick={() => startTransition(retry)}
          disabled={pending}
          size="lg"
          className="h-12 px-6"
        >
          {pending ? (
            <Spinner data-icon="inline-start" aria-hidden="true" />
          ) : (
            <RotateCcw data-icon="inline-start" aria-hidden="true" />
          )}
          {pending ? "Пробуем снова…" : "Попробовать снова"}
        </Button>
        <ButtonLink href="/" variant="outline" className="h-12 px-6">
          <ArrowLeft data-icon="inline-start" />
          На главную
        </ButtonLink>
      </div>
      <p role="status" className="sr-only">
        {pending ? "Повторно загружаем страницу." : ""}
      </p>
    </section>
  )
}

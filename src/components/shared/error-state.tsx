"use client"

import { ArrowLeft, RotateCcw, TriangleAlert } from "lucide-react"
import { useEffect, useRef, useTransition } from "react"
import { Container } from "@/components/layout/container"
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
    <Container className="py-20 md:py-28">
      <TriangleAlert
        className="mb-8 size-9 text-muted-foreground"
        aria-hidden="true"
      />
      <p className="eyebrow mb-6">Временная ошибка</p>
      <h1
        ref={headingRef}
        tabIndex={-1}
        className="max-w-2xl text-4xl font-medium tracking-tight outline-none sm:text-5xl"
      >
        Не удалось открыть страницу.
      </h1>
      <p className="mt-6 mb-10 max-w-lg leading-relaxed text-muted-foreground">
        Попробуйте ещё раз. Если ошибка повторится, вернитесь немного позже.
      </p>
      <div className="flex flex-wrap gap-3">
        <Button
          onClick={() => startTransition(retry)}
          disabled={pending}
          size="lg"
          className="min-h-11"
        >
          {pending ? (
            <Spinner data-icon="inline-start" aria-hidden="true" />
          ) : (
            <RotateCcw data-icon="inline-start" aria-hidden="true" />
          )}
          {pending ? "Пробуем снова…" : "Попробовать снова"}
        </Button>
        <ButtonLink href="/" variant="outline" className="min-h-11">
          <ArrowLeft data-icon="inline-start" />
          На главную
        </ButtonLink>
      </div>
      <p role="status" className="sr-only">
        {pending ? "Повторно загружаем страницу." : ""}
      </p>
    </Container>
  )
}

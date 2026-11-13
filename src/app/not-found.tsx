import { PulsarMark } from "@/components/shared/logo"
import type { Metadata } from "next"
import { ButtonLink } from "@/components/shared/button-link"

export const metadata: Metadata = {
  title: "Страница не найдена",
  alternates: { canonical: null },
  robots: { index: false, follow: true },
}

export default function NotFound() {
  return (
    <section
      className="not-found-page relative isolate m-2 flex min-h-[calc(100dvh-1rem)] flex-col items-center justify-center overflow-hidden rounded-3xl border border-border px-6 py-16 text-center"
      aria-labelledby="not-found-title"
    >
      <PulsarMark className="mb-6 size-16" />
      <h1
        id="not-found-title"
        className="max-w-4xl text-4xl font-medium tracking-tight text-balance sm:text-6xl"
      >
        Страница не найдена
      </h1>
      <ButtonLink
        href="/"
        className="mt-8 h-12 bg-foreground px-6 text-background hover:bg-foreground/90"
      >
        На главную
      </ButtonLink>
    </section>
  )
}

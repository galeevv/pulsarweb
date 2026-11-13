import type { ReactNode } from "react"
import { Container } from "@/components/layout/container"
import { HomeHeroSurface } from "@/components/shared/home-hero-surface"

export function MarketingHero({
  children,
  labelledBy,
}: {
  children: ReactNode
  labelledBy: string
}) {
  return (
    <Container className="home-hero-shell py-3 sm:py-4 xl:max-w-none xl:px-3">
      <section
        aria-labelledby={labelledBy}
        className="home-hero dark relative isolate overflow-hidden rounded-3xl bg-background text-foreground sm:rounded-[2rem]"
      >
        <HomeHeroSurface>
          <Container className="home-hero-content relative flex min-h-[calc(100svh-6.5rem)] items-center justify-center px-4 py-24 sm:min-h-[calc(100svh-7rem)] sm:px-6 lg:px-8 xl:px-16">
            <div className="hero-intro-content flex w-full flex-col items-center gap-8 text-center">
              {children}
            </div>
          </Container>
        </HomeHeroSurface>
      </section>
    </Container>
  )
}

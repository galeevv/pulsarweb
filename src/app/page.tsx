import { HomeMotion } from "@/components/shared/home-motion"
import type { Metadata } from "next"
import { Container } from "@/components/layout/container"
import { ButtonLink } from "@/components/shared/button-link"
import { ArrowRight, ArrowUpRight } from "lucide-react"
import { websiteJsonLd } from "@/lib/seo"
import { DunesBackground } from "@/components/shared/dunes-background"
import { Section } from "@/components/layout/section"
import { DeliveryProcess } from "@/components/shared/delivery-process"
import { LatestProjects } from "@/components/shared/latest-projects"
import { ServiceCards } from "@/components/shared/service-cards"
import { WhyPulsarWeb } from "@/components/shared/why-pulsarweb"
import { Badge } from "@/components/ui/badge"

export const metadata: Metadata = {
  title: { absolute: "PulsarWeb — Разработка сайтов и Telegram Mini Apps" },
}

export default function Page() {
  return (
    <HomeMotion>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: websiteJsonLd() }}
      />
      <Container className="home-hero-shell py-3 sm:py-4 xl:max-w-none xl:px-3">
        <section
          aria-labelledby="hero-title"
          data-home-static
          className="home-hero dark relative isolate overflow-hidden rounded-3xl bg-background text-foreground sm:rounded-[2rem]"
        >
          <DunesBackground />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-black/55"
          />
          <Container className="relative flex min-h-[calc(100svh-6.5rem)] items-center justify-center px-4 py-24 sm:min-h-[calc(100svh-7rem)] sm:px-6 lg:px-8 xl:px-16">
            <div className="flex w-full flex-col items-center gap-8 text-center">
              <Badge variant="outline" className="h-7 px-3">
                Веб студия
              </Badge>
              <h1
                id="hero-title"
                className="max-w-[17ch] text-3xl leading-[1.1] font-medium tracking-tight break-normal hyphens-none sm:text-5xl lg:text-6xl"
              >
                Разрабатываем цифровые продукты для бизнеса
              </h1>
              <p className="max-w-md text-lg leading-relaxed text-foreground/90">
                От первой идеи до работающего продукта.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <ButtonLink href="/start" className="min-h-12 px-5">
                  Обсудить проект
                  <ArrowUpRight data-icon="inline-end" aria-hidden="true" />
                </ButtonLink>
                <ButtonLink
                  href="/projects"
                  variant="outline"
                  className="min-h-12 px-5"
                >
                  Посмотреть проекты
                  <ArrowRight data-icon="inline-end" aria-hidden="true" />
                </ButtonLink>
              </div>
            </div>
          </Container>
        </section>
      </Container>
      <Section className="pt-10 md:pt-14" id="services">
        <ServiceCards />
      </Section>
      <Section className="dark home-dark-panel text-foreground" id="process">
        <h2 className="home-section-title mb-12 md:mb-16" data-home-heading>
          Как мы работаем
        </h2>
        <DeliveryProcess />
      </Section>
      <Section id="projects">
        <div className="mb-12 flex flex-wrap items-center justify-between gap-6 md:mb-16">
          <h2 className="home-section-title" data-home-heading>
            Наши проекты
          </h2>
          <ButtonLink
            href="/projects"
            variant="outline"
            className="hidden shrink-0 md:inline-flex"
          >
            Все проекты{" "}
            <ArrowUpRight data-icon="inline-end" aria-hidden="true" />
          </ButtonLink>
        </div>
        <LatestProjects />
        <div className="mt-8 flex justify-center md:hidden" data-home-reveal>
          <ButtonLink href="/projects" variant="outline">
            Все проекты{" "}
            <ArrowUpRight data-icon="inline-end" aria-hidden="true" />
          </ButtonLink>
        </div>
      </Section>
      <WhyPulsarWeb />
    </HomeMotion>
  )
}

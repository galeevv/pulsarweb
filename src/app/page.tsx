import { Container } from "@/components/layout/container"
import { ButtonLink } from "@/components/shared/button-link"
import { ArrowRight, ArrowUpRight } from "lucide-react"
import { websiteJsonLd } from "@/lib/seo"
import { DunesBackground } from "@/components/shared/dunes-background"
import { Section } from "@/components/layout/section"
import { DeliveryProcess } from "@/components/shared/delivery-process"
import { LatestProjects } from "@/components/shared/latest-projects"
import { SectionHeader } from "@/components/shared/section-header"
import { ServiceList } from "@/components/shared/service-list"

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: websiteJsonLd() }}
      />
      <div className="p-3 sm:p-4">
        <section
          aria-labelledby="hero-title"
          className="dark relative isolate overflow-hidden rounded-3xl bg-background text-foreground sm:rounded-[2rem]"
        >
          <DunesBackground />
          <Container className="relative flex min-h-[calc(100svh-7.5rem)] items-center justify-center py-24 sm:min-h-[calc(100svh-8rem)] xl:justify-start">
            <div className="flex w-full max-w-2xl flex-col items-center gap-8 rounded-3xl bg-black/65 p-6 text-center backdrop-blur-sm sm:p-10 xl:items-start xl:text-left">
              <p className="eyebrow text-foreground/80">Студия разработки</p>
              <h1
                id="hero-title"
                className="text-[clamp(2rem,4.5vw,4rem)] leading-[1.05] font-medium tracking-[-0.06em] break-normal hyphens-none"
              >
                <span className="block">Разрабатываем</span>{" "}
                <span className="block xl:whitespace-nowrap">
                  цифровые продукты
                </span>{" "}
                <span className="block">для бизнеса</span>
              </h1>
              <p className="max-w-md text-lg leading-relaxed text-foreground/90">
                От первой идеи до работающего продукта. Разработка, запуск и
                сопровождение.
              </p>
              <div className="flex flex-wrap justify-center gap-3 xl:justify-start">
                <ButtonLink href="/contacts" className="min-h-12 px-5">
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
      </div>
      <Section className="pt-10 md:pt-14" id="services">
        <SectionHeader
          eyebrow="Что делаем"
          title="Что нужно вашему бизнесу?"
          description="Представить компанию, организовать работу с заявками или связать сервисы — подберём решение под вашу задачу."
        />
        <ServiceList compact />
      </Section>
      <Section className="bg-muted/40" id="projects">
        <SectionHeader
          eyebrow="Наши работы"
          title="Что мы создаём."
          description="Знакомьтесь с проектами PulsarWeb — от персональных сайтов до самостоятельных сервисов."
        />
        <LatestProjects />
      </Section>
      <Section id="process">
        <SectionHeader
          eyebrow="Как работаем"
          title="Работаем поэтапно."
          description="Согласуем задачу, показываем промежуточные результаты и готовим проект к запуску."
        />
        <DeliveryProcess />
      </Section>
    </>
  )
}

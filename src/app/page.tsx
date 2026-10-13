import { Container } from "@/components/layout/container"
import { ButtonLink } from "@/components/shared/button-link"
import { ArrowRight, ArrowUpRight } from "lucide-react"
import { websiteJsonLd } from "@/lib/seo"
import { PulsarMark } from "@/components/shared/logo"
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
      <Container>
        <section
          aria-labelledby="hero-title"
          className="flex min-h-[calc(100svh-6rem)] flex-col justify-center gap-6 py-8 xl:grid xl:grid-cols-[1.7fr_1fr] xl:items-center xl:gap-12 xl:py-20"
        >
          <div className="flex flex-col items-center gap-8 text-center xl:items-start xl:text-left">
            <p className="eyebrow">Студия разработки</p>
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
            <p className="max-w-md text-lg leading-relaxed text-muted-foreground">
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
          <PulsarMark
            size={400}
            className="hidden size-full max-h-96 text-foreground xl:block"
          />
        </section>
      </Container>
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

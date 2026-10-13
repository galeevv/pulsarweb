import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ArrowUpRight, Check } from "lucide-react"

import { Section } from "@/components/layout/section"
import { ButtonLink } from "@/components/shared/button-link"
import { CTA } from "@/components/shared/cta"
import { PageHeader } from "@/components/shared/page-header"
import { SectionHeader } from "@/components/shared/section-header"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Separator } from "@/components/ui/separator"
import { getService, services } from "@/config/services"
import { pageMetadata } from "@/lib/seo"

type ServicePageProps = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return services.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: ServicePageProps) {
  const { slug } = await params
  const service = getService(slug)
  if (!service) notFound()
  return pageMetadata(
    service.shortTitle,
    service.description,
    `/services/${service.slug}`
  )
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params
  const service = getService(slug)
  if (!service) notFound()

  return (
    <>
      <PageHeader
        eyebrow={service.eyebrow}
        title={service.title}
        description={service.description}
      />
      <Section className="pt-0 md:pt-0">
        <div className="flex flex-wrap items-center gap-4">
          <ButtonLink href={`/contacts?service=${service.slug}`}>
            Обсудить проект <ArrowUpRight data-icon="inline-end" />
          </ButtonLink>
          <ButtonLink href="/services" variant="ghost">
            <ArrowLeft data-icon="inline-start" /> Все услуги
          </ButtonLink>
        </div>
      </Section>
      <Separator />
      <Section>
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
          <div>
            <p className="eyebrow mb-6">Подход к задаче</p>
            <h2 className="text-2xl leading-snug font-medium tracking-tight md:text-3xl">
              {service.intro}
            </h2>
          </div>
          <div className="flex flex-col gap-10">
            {service.outcomes.map((outcome) => (
              <div key={outcome.title} className="flex flex-col gap-3">
                <h3 className="text-xl font-medium tracking-tight">
                  {outcome.title}
                </h3>
                <p className="max-w-xl leading-relaxed text-muted-foreground">
                  {outcome.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Section>
      <Section className="bg-muted/40">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-20">
          <SectionHeader
            eyebrow="Что можем сделать"
            title="Конкретные решения. Согласованный объём."
            description="Состав проекта определяем после знакомства с задачей. Начинаем с необходимого и оставляем понятный путь для дальнейшего развития."
          />
          <ul className="flex flex-col gap-6 lg:pt-10">
            {service.deliverables.map((deliverable) => (
              <li key={deliverable} className="flex items-start gap-4 text-lg">
                <Check
                  className="mt-1 size-5 shrink-0 text-muted-foreground"
                  aria-hidden="true"
                />
                {deliverable}
              </li>
            ))}
          </ul>
        </div>
      </Section>
      <Section>
        <SectionHeader eyebrow="Процесс" title="Понятно на каждом этапе." />
        <ol className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {service.process.map((step, index) => (
            <li key={step.title} className="flex flex-col gap-5">
              <p
                className="font-mono text-xs text-muted-foreground"
                aria-hidden="true"
              >
                0{index + 1}
              </p>
              <Separator />
              <h3 className="text-xl font-medium tracking-tight">
                {step.title}
              </h3>
              <p className="leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </Section>
      <Section className="pt-0 md:pt-0">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-20">
          <SectionHeader eyebrow="Перед началом" title="Частые вопросы." />
          <Accordion>
            {service.faq.map((item) => (
              <AccordionItem key={item.question} value={item.question}>
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </Section>
      <Section className="pt-0 md:pt-0" aria-label="Другие направления">
        <p className="eyebrow mb-6">Другие направления</p>
        <nav className="flex flex-wrap gap-x-8 gap-y-4" aria-label="Услуги">
          {services
            .filter((item) => item.slug !== service.slug)
            .map((item) => (
              <Link
                key={item.slug}
                href={`/services/${item.slug}`}
                className="text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
              >
                {item.shortTitle}
              </Link>
            ))}
        </nav>
      </Section>
      <CTA href={`/contacts?service=${service.slug}`} />
    </>
  )
}

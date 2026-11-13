import Link from "next/link"
import { ArrowUpRight, Wrench, Lightbulb } from "lucide-react"

import { Section } from "@/components/layout/section"
import { ServiceCards } from "@/components/shared/service-cards"
import { pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata(
  "Услуги",
  "Лендинги под рекламу, корпоративные сайты, интернет-магазины и бизнес в Telegram. Разработка и запуск под ключ.",
  "/services"
)

export default function ServicesPage() {
  return (
    <Section className="pt-12 md:pt-20" aria-label="Направления разработки">
      <h1 className="home-section-title mb-12 md:mb-16">Услуги</h1>
      <ServiceCards showHeading={false} />
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {[
          {
            id: "support",
            title: "Сопровождение",
            description: "Поддержка и развитие сайта после запуска.",
            icon: Wrench,
          },
          {
            id: "other",
            title: "Другой проект",
            description: "Нестандартная задача? Обсудим и предложим решение.",
            icon: Lightbulb,
          },
        ].map(({ id, title, description, icon: Icon }) => (
          <Link
            key={id}
            href={`/start?service=${id}`}
            aria-labelledby={`additional-service-${id}`}
            className="flex items-start gap-4 rounded-3xl border border-border p-6 hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring sm:p-8"
          >
            <Icon
              aria-hidden="true"
              className="mt-1 size-6 shrink-0 text-muted-foreground"
            />
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <h2
                id={`additional-service-${id}`}
                className="text-xl font-medium tracking-tight sm:text-2xl"
              >
                {title}
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {description}
              </p>
            </div>
            <ArrowUpRight aria-hidden="true" className="mt-1 size-5 shrink-0" />
          </Link>
        ))}
      </div>
    </Section>
  )
}

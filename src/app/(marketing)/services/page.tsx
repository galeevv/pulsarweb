import { ArrowUpRight } from "lucide-react"

import { Section } from "@/components/layout/section"
import { ButtonLink } from "@/components/shared/button-link"
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
      <div className="mt-8">
        <ButtonLink href="/services/other" variant="ghost">
          Другой проект <ArrowUpRight data-icon="inline-end" />
        </ButtonLink>
      </div>
    </Section>
  )
}

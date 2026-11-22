import { Section } from "@/components/layout/section"
import { ServiceCards } from "@/components/shared/service-cards"
import { pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata(
  "Услуги",
  "Лендинги под рекламу, корпоративные сайты, интернет-магазины и бизнес в Telegram. Разработка под ключ и техническое сопровождение.",
  "/services"
)

export default function ServicesPage() {
  return (
    <Section className="pt-12 md:pt-20" aria-labelledby="services-title">
      <h1 id="services-title" className="home-section-title mb-12 md:mb-16">
        Услуги
      </h1>
      <ServiceCards showHeading={false} />
    </Section>
  )
}

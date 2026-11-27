import { MarketingHero } from "@/components/shared/marketing-hero"
import { ButtonLink } from "@/components/shared/button-link"
import { homeMetadata, websiteJsonLd } from "@/lib/seo"
import { Section } from "@/components/layout/section"
import { DeliveryProcess } from "@/components/shared/delivery-process"
import { LatestProjects } from "@/components/shared/latest-projects"
import { HomeServices } from "@/components/shared/home-services"
import { WhyPulsarWeb } from "@/components/shared/why-pulsarweb"
import { HomeBadge } from "@/components/shared/home-badge"

export const metadata = homeMetadata()

export default function Page() {
  return (
    <div className="homepage">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: websiteJsonLd() }}
      />
      <MarketingHero labelledBy="hero-title">
        <HomeBadge large>Веб студия</HomeBadge>
        <h1
          id="hero-title"
          className="home-hero-title break-normal hyphens-none"
        >
          Сайты, которые приносят
          <br className="hidden lg:block" /> заявки и продажи
        </h1>
        <p className="hero-intro-description max-w-md text-lg leading-relaxed text-foreground/90">
          От идеи до запуска
        </p>
        <div className="hero-intro-actions flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:justify-center">
          <ButtonLink href="/start">Обсудить проект</ButtonLink>
          <ButtonLink href="/projects" variant="outline">
            Посмотреть проекты
          </ButtonLink>
        </div>
      </MarketingHero>
      <Section className="pt-10 md:pt-14" id="services">
        <HomeServices />
      </Section>
      <Section className="dark home-dark-panel text-foreground" id="process">
        <h2 className="home-section-title mb-12 text-left md:mb-20 md:text-center">
          Как мы работаем
        </h2>
        <DeliveryProcess />
      </Section>
      <Section id="projects">
        <div className="mb-12 flex flex-wrap items-center justify-between gap-6 md:mb-16">
          <h2 className="home-section-title">Наши проекты</h2>
          <ButtonLink
            href="/projects"
            variant="outline"
            className="hidden shrink-0 md:inline-flex"
          >
            Все проекты
          </ButtonLink>
        </div>
        <LatestProjects />
        <div className="mt-8 flex justify-center md:hidden">
          <ButtonLink href="/projects" variant="outline">
            Все проекты
          </ButtonLink>
        </div>
      </Section>
      <WhyPulsarWeb />
    </div>
  )
}

import { Send } from "lucide-react"
import { redirect } from "next/navigation"
import { MarketingHero } from "@/components/shared/marketing-hero"
import { HomeBadge } from "@/components/shared/home-badge"
import { ButtonLink } from "@/components/shared/button-link"
import { pageMetadata } from "@/lib/seo"
import { contactQuerySchema } from "@/modules/leads/contracts"
import { projectRequestHref } from "@/modules/leads/domain/request-config"
import { getTelegramOwnerContact } from "@/lib/env/server"

export const metadata = pageMetadata(
  "Контакты",
  "Свяжитесь с PulsarWeb: обсудите разработку сайта или Telegram Mini App в заявке или напрямую в Telegram.",
  "/contacts"
)
export default async function ContactsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const { service } = contactQuerySchema.parse(await searchParams)
  if (service) redirect(projectRequestHref(service))
  const owner = getTelegramOwnerContact()
  return (
    <MarketingHero labelledBy="contacts-title">
      <HomeBadge large>Контакты</HomeBadge>
      <h1
        id="contacts-title"
        className="home-hero-title break-normal hyphens-none"
      >
        Связаться с PulsarWeb
      </h1>
      <p className="hero-intro-description max-w-2xl text-lg leading-relaxed text-foreground/90">
        По вопросам проектов и сотрудничества можно написать напрямую в Telegram
        или оставить заявку.
      </p>
      <div className="hero-intro-actions flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:justify-center">
        <ButtonLink href={owner.url}>
          <Send data-icon="inline-start" aria-hidden="true" />
          Написать в Telegram{" "}
        </ButtonLink>
        <ButtonLink href="/start" variant="outline">
          Оставить заявку{" "}
        </ButtonLink>
      </div>
    </MarketingHero>
  )
}

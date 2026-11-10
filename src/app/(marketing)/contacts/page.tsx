import { site } from "@/config/site"
import { redirect } from "next/navigation"
import { ArrowUpRight, MessageCircle } from "lucide-react"
import { Section } from "@/components/layout/section"
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
    <Section className="flex flex-1 items-center py-6 md:py-10">
      <div className="mx-auto w-full max-w-xl rounded-3xl border border-border/70 bg-muted/30 p-4 sm:p-6">
        <div className="flex flex-col items-center gap-6 px-2 py-10 text-center sm:px-6">
          <div className="flex size-16 items-center justify-center rounded-2xl border border-border bg-background">
            <MessageCircle
              className="size-7"
              strokeWidth={1.5}
              aria-hidden="true"
            />
          </div>
          <div className="flex flex-col gap-3">
            <h1 className="text-3xl font-medium tracking-tight sm:text-4xl">
              Начнём с разговора
            </h1>
            <p className="max-w-sm text-base leading-relaxed text-muted-foreground">
              Обсудим вашу идею и ответим на вопросы.
            </p>
          </div>
          <div className="mt-2 flex w-full flex-col gap-3">
            <ButtonLink href={owner.url} className="h-12 w-full">
              Написать в Telegram <ArrowUpRight data-icon="inline-end" />
            </ButtonLink>
            <ButtonLink
              href={site.telegramChannelUrl}
              variant="outline"
              className="h-12 w-full"
            >
              Мы в Telegram <ArrowUpRight data-icon="inline-end" />
            </ButtonLink>
          </div>
        </div>
      </div>
    </Section>
  )
}

import { redirect } from "next/navigation"
import Link from "next/link"
import { ArrowUpRight, MessageCircle, MoveUpRight } from "lucide-react"
import { Section } from "@/components/layout/section"
import { ButtonLink } from "@/components/shared/button-link"
import { Separator } from "@/components/ui/separator"
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
    <Section className="pt-12 pb-12 md:pt-20 md:pb-20">
      <div className="mb-10 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between md:gap-12">
        <h1 className="max-w-3xl text-5xl leading-[1.05] font-medium tracking-[-0.05em] sm:text-6xl lg:text-7xl">
          Начнём с разговора
        </h1>
        <p className="max-w-sm text-base leading-relaxed text-muted-foreground md:pb-1">
          Расскажите об идее или задаче бизнеса. Вместе определим, что нужно
          вашему проекту.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-[1.2fr_1fr] md:gap-6">
        <section
          aria-labelledby="contact-project-title"
          className="dark flex flex-col items-start gap-8 rounded-3xl bg-background p-6 text-foreground sm:rounded-[2rem] sm:p-10 lg:p-12"
        >
          <MoveUpRight
            aria-hidden="true"
            className="size-9"
            strokeWidth={1.25}
          />
          <div className="flex flex-col gap-4">
            <h2
              id="contact-project-title"
              className="text-3xl font-medium tracking-tight sm:text-4xl"
            >
              Обсудим проект
            </h2>
            <p className="max-w-md leading-relaxed text-muted-foreground">
              Сайт, интернет-магазин или Telegram Mini App. Опишите задачу,
              пожелания и сроки — начнём с главного.
            </p>
          </div>
          <ButtonLink href="/start" className="mt-auto min-h-12 px-5">
            Обсудить проект{" "}
            <ArrowUpRight data-icon="inline-end" aria-hidden="true" />
          </ButtonLink>
        </section>

        <section
          aria-labelledby="contact-telegram-title"
          className="flex flex-col items-start gap-8 rounded-3xl bg-muted p-6 sm:rounded-[2rem] sm:p-10 lg:p-12"
        >
          <MessageCircle
            aria-hidden="true"
            className="size-9"
            strokeWidth={1.25}
          />
          <div className="flex min-w-0 flex-col gap-4">
            <h2
              id="contact-telegram-title"
              className="text-3xl font-medium tracking-tight sm:text-4xl"
            >
              Напишите напрямую
            </h2>
            <p className="max-w-md leading-relaxed text-muted-foreground">
              Предпочитаете живой диалог? Обсудите идею и задайте вопросы
              напрямую разработчику в Telegram.
            </p>
            <p className="text-lg font-medium tracking-tight break-all">
              @{owner.username}
            </p>
          </div>
          <ButtonLink href={owner.url} className="mt-auto min-h-12 px-5">
            Написать в Telegram{" "}
            <ArrowUpRight data-icon="inline-end" aria-hidden="true" />
          </ButtonLink>
        </section>
      </div>

      <div className="mt-10 md:mt-12">
        <Separator />
        <div className="flex flex-col items-start justify-between gap-4 pt-6 sm:flex-row sm:items-center sm:gap-8">
          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
            Уже работали с PulsarWeb? Поможем с поддержкой и развитием вашего
            проекта.
          </p>
          <Link
            href={projectRequestHref("support")}
            className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-sm text-sm font-medium underline-offset-4 hover:underline"
          >
            Обсудить сопровождение{" "}
            <ArrowUpRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
      </div>
    </Section>
  )
}

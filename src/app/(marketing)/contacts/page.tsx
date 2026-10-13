import { ContactForm } from "@/components/contact/contact-form"
import { Section } from "@/components/layout/section"
import { services } from "@/config/services"
import { pageMetadata } from "@/lib/seo"
import { contactQuerySchema } from "@/modules/leads"
import { MessageSquare, ListChecks, ArrowRight } from "lucide-react"

export const metadata = pageMetadata(
  "Обсудить проект",
  "Расскажите о задаче: сайт, web-система, Telegram-автоматизация или инфраструктура. Обсудим подход, объём и следующие шаги.",
  "/contacts"
)

export default async function ContactsPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string | string[] }>
}) {
  const { service: selectedService } = contactQuerySchema.parse(
    await searchParams
  )

  return (
    <>
      <Section className="pt-4 md:pt-8">
        <div className="grid gap-14 lg:grid-cols-[0.8fr_1fr] lg:gap-24">
          <div className="min-w-0 lg:col-start-2 lg:row-start-1">
            <ContactForm
              services={services.map(({ slug, shortTitle }) => ({
                value: slug,
                label: shortTitle,
              }))}
              initialService={selectedService}
            />
          </div>
          <aside className="flex flex-col items-start gap-8 lg:col-start-1 lg:row-start-1">
            <h2 className="max-w-sm text-2xl leading-tight font-medium tracking-tight md:text-3xl">
              Можно без готового ТЗ.
            </h2>
            <p className="max-w-sm leading-relaxed text-muted-foreground">
              Достаточно описать идею, текущую проблему или процесс, который
              хочется упростить. Детали разберём в разговоре.
            </p>
            <ol className="flex max-w-sm flex-col gap-8">
              {(
                [
                  [
                    MessageSquare,
                    "Разберёмся в задаче",
                    "Уточним контекст, пользователей и ограничения.",
                  ],
                  [
                    ListChecks,
                    "Предложим подход",
                    "Определим состав первой версии и порядок работы.",
                  ],
                  [
                    ArrowRight,
                    "Согласуем следующий шаг",
                    "Обсудим объём, сроки и бюджет до начала разработки.",
                  ],
                ] as const
              ).map(([Icon, title, description]) => (
                <li key={title} className="flex gap-5">
                  <Icon
                    aria-hidden="true"
                    className="mt-1 size-5 shrink-0 text-muted-foreground"
                  />
                  <div className="flex flex-col gap-2">
                    <h3 className="font-medium">{title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </aside>
        </div>
      </Section>
    </>
  )
}

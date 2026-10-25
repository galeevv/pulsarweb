import { Section } from "@/components/layout/section"
import { pageMetadata } from "@/lib/seo"
import { getTelegramOwnerContact } from "@/lib/env/server"
import { contactQuerySchema } from "@/modules/leads/contracts"
import { ProjectRequestWizard } from "@/modules/leads/ui/project-request-wizard"

export const metadata = pageMetadata(
  "Расскажите о проекте",
  "Новый проект с нуля под ключ или сопровождение проекта PulsarWeb. Опишите задачу — техническую часть и запуск мы берём на себя.",
  "/start"
)

export default async function StartPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const query = await searchParams
  const { service } = contactQuerySchema.parse(query)
  const text = (key: string, max: number) =>
    typeof query[key] === "string" ? query[key].slice(0, max) : undefined
  const source = text("source", 2048)
  return (
    <Section className="flex flex-1 items-center py-6 md:py-10">
      <div className="mx-auto w-full max-w-xl rounded-3xl border border-border/70 bg-muted/30 p-4 sm:p-6">
        <ProjectRequestWizard
          key={service ?? "choose"}
          initialService={service}
          telegramUrl={getTelegramOwnerContact().url}
          attribution={{
            sourceUrl:
              source?.startsWith("/") && !source.startsWith("//")
                ? source
                : undefined,
            utmSource: text("utm_source", 200),
            utmMedium: text("utm_medium", 200),
            utmCampaign: text("utm_campaign", 200),
          }}
        />
      </div>
    </Section>
  )
}

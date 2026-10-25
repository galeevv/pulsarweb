import { ArrowUpRight } from "lucide-react"
import { Section } from "@/components/layout/section"
import { ButtonLink } from "@/components/shared/button-link"
import { Separator } from "@/components/ui/separator"
import { serviceCatalog } from "@/config/service-catalog"

export function SupportOffer() {
  const service = serviceCatalog.support
  return (
    <Section
      id="support"
      aria-labelledby="support-title"
      className="pt-0 md:pt-0"
    >
      <Separator className="mb-10" />
      <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
        <div className="flex max-w-2xl flex-col gap-4">
          <p className="eyebrow">После запуска</p>
          <h2
            id="support-title"
            className="text-2xl font-medium tracking-tight sm:text-3xl"
          >
            {service.shortTitle}
          </h2>
          <p className="leading-relaxed text-muted-foreground">
            {service.description}
          </p>
          <p className="text-sm text-muted-foreground">
            Подключается по желанию и оплачивается отдельно.
          </p>
        </div>
        <ButtonLink
          href="/services/support"
          variant="outline"
          className="shrink-0"
        >
          Подробнее о сопровождении <ArrowUpRight data-icon="inline-end" />
        </ButtonLink>
      </div>
    </Section>
  )
}

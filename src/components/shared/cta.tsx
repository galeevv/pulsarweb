import { ArrowUpRight } from "lucide-react"
import { Section } from "@/components/layout/section"
import { ButtonLink } from "@/components/shared/button-link"
import { Separator } from "@/components/ui/separator"

export function CTA({
  title = "С чего начнём?",
  description = "Расскажите о задаче. Обсудим, что нужно бизнесу, и предложим понятный следующий шаг.",
  href = "/contacts",
  className,
}: {
  title?: string
  description?: string
  href?: string
  className?: string
}) {
  return (
    <>
      <Separator />
      <Section className={className}>
        <div className="flex flex-col items-start justify-between gap-10 md:flex-row md:items-end">
          <div>
            <p className="eyebrow mb-6">Следующий шаг</p>
            <h2 className="text-4xl font-medium tracking-[-0.05em] md:text-6xl">
              {title}
            </h2>
            <p className="mt-6 max-w-lg leading-relaxed text-muted-foreground">
              {description}
            </p>
          </div>
          <ButtonLink href={href} className="h-12 px-6">
            Обсудить проект
            <ArrowUpRight data-icon="inline-end" />
          </ButtonLink>
        </div>
      </Section>
    </>
  )
}

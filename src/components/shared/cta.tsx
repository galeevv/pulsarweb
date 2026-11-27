import { Section } from "@/components/layout/section"
import { ButtonLink } from "@/components/shared/button-link"
import { cn } from "@/lib/utils"

export function CTA({
  title = "С чего начнём?",
  description = "Расскажите о задаче. Обсудим, что нужно бизнесу, и предложим понятный следующий шаг.",
  href = "/start",
  label = "Обсудить проект",
  className,
  homeHeading = false,
}: {
  title?: string
  description?: string
  href?: string
  label?: string
  className?: string
  homeHeading?: boolean
}) {
  return (
    <>
      <Section
        className={cn("dark home-dark-panel text-foreground", className)}
      >
        <div
          className={cn(
            "flex flex-col items-start justify-between gap-10",
            homeHeading ? "[&>div]:w-full" : "md:flex-row md:items-end"
          )}
        >
          <div>
            {!homeHeading && <p className="eyebrow mb-6">Следующий шаг</p>}
            <h2
              className={
                homeHeading
                  ? "home-section-title"
                  : "max-w-[18ch] text-4xl font-medium tracking-[-0.05em] md:text-6xl"
              }
            >
              {title}
            </h2>
            <p className="mt-6 max-w-lg leading-relaxed text-muted-foreground">
              {description}
            </p>
          </div>
          <ButtonLink
            href={href}
            className="w-full shrink-0 sm:w-auto"
          >
            {label}
          </ButtonLink>
        </div>
      </Section>
    </>
  )
}

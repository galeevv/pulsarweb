import { ArrowUpRight, Check, Minus } from "lucide-react"
import { Section } from "@/components/layout/section"
import { ButtonLink } from "@/components/shared/button-link"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

const approaches = [
  {
    title: "Обычная студия",
    points: [
      "Этапы могут выполнять разные команды",
      "Общение часто идёт через менеджера",
      "Решения могут опираться на шаблон",
      "Хостинг и запуск могут остаться клиенту",
    ],
  },
  {
    title: "PulsarWeb",
    points: [
      "Полный цикл: от идеи до запуска",
      "Прямое общение с разработчиком",
      "Современные технологии без лишней сложности",
      "Инфраструктура и запуск включены",
    ],
  },
] as const

export function WhyPulsarWeb() {
  return (
    <Section
      id="why-pulsarweb"
      aria-labelledby="why-pulsarweb-title"
      className="dark home-dark-panel text-foreground"
    >
      <h2
        id="why-pulsarweb-title"
        className="home-section-title mb-12 md:mb-16"
        data-home-heading
      >
        Почему PulsarWeb
      </h2>
      <div className="relative" data-home-reveal>
        <div className="grid overflow-hidden rounded-[2rem] md:grid-cols-2">
          {approaches.map((approach, index) => {
            const Icon = index === 1 ? Check : Minus
            return (
              <article
                key={approach.title}
                aria-labelledby={`approach-${index}`}
                className={cn(
                  "px-5 py-6 sm:px-7 sm:py-7",
                  index === 0
                    ? "comparison-standard bg-background text-foreground"
                    : "bg-card text-card-foreground"
                )}
              >
                <h3
                  id={`approach-${index}`}
                  className="mb-4 text-2xl font-medium tracking-tight sm:text-3xl"
                >
                  {approach.title}
                </h3>
                <ul>
                  {approach.points.map((point) => (
                    <li key={point}>
                      <Separator />
                      <div className="flex min-h-16 items-center gap-3 py-3">
                        <Icon
                          aria-hidden="true"
                          className="size-5 shrink-0 text-muted-foreground"
                          strokeWidth={1.5}
                        />
                        <p className="text-sm leading-relaxed">{point}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </article>
            )
          })}
        </div>
        <span
          aria-hidden="true"
          className="absolute top-1/2 left-1/2 hidden size-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card font-mono text-xs text-card-foreground md:flex"
        >
          VS
        </span>
      </div>
      <div className="mt-10 flex justify-center md:mt-12" data-home-reveal>
        <ButtonLink href="/start" className="min-h-12 px-5">
          Обсудить проект{" "}
          <ArrowUpRight data-icon="inline-end" aria-hidden="true" />
        </ButtonLink>
      </div>
    </Section>
  )
}

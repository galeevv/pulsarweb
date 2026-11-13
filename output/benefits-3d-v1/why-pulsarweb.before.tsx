import {
  ChartNoAxesCombined,
  MousePointer2,
  ArrowUpRight,
  ArrowRight,
  Check,
  Code2,
  Gift,
  LayoutTemplate,
  MessageCircle,
  Send,
  SlidersHorizontal,
  Workflow,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Section } from "@/components/layout/section"
import { ButtonLink } from "@/components/shared/button-link"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"

const benefits = [
  {
    title: "От идеи до запуска",
    text: "Структура, дизайн, разработка и публикация — берём весь цикл на себя.",
    visual: "cycle",
  },
  {
    title: "Напрямую с разработчиком",
    text: "Обсуждаете задачу с тем, кто её реализует.",
    visual: "contact",
  },
  {
    title: "Под вашу задачу",
    text: "Подбираем технологии и интеграции под потребности бизнеса.",
    visual: "solution",
  },
  {
    title: "2 месяца сопровождения включены",
    text: "Помогаем с техническими вопросами и исправляем выявленные ошибки.",
    visual: "support",
  },
  {
    title: "Готовим к запуску рекламы",
    text: "Подключаем аналитику и UTM-метки. Помогаем с рекламным кабинетом и доступными бонусами.",
    visual: "ads",
  },
] as const

function BenefitVisual({
  kind,
}: {
  kind: (typeof benefits)[number]["visual"]
}) {
  return (
    <div
      aria-hidden="true"
      className="flex aspect-[2/1] max-h-56 items-center justify-center overflow-hidden rounded-3xl bg-background/50 px-5 sm:rounded-[2rem]"
    >
      {kind === "cycle" ? (
        <div className="flex items-center gap-3 text-muted-foreground">
          <div className="flex size-16 items-center justify-center rounded-2xl border border-border bg-card">
            <LayoutTemplate className="size-7" strokeWidth={1.5} />
          </div>
          <ArrowRight className="size-4" />
          <div className="flex size-16 items-center justify-center rounded-2xl border border-border bg-card">
            <Code2 className="size-7" strokeWidth={1.5} />
          </div>
          <ArrowRight className="size-4" />
          <div className="flex size-16 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-primary">
            <Check className="size-7" strokeWidth={1.5} />
          </div>
        </div>
      ) : kind === "contact" ? (
        <div className="flex w-full max-w-64 flex-col gap-3">
          <div className="flex items-center gap-3 self-start rounded-2xl rounded-bl-sm border border-border bg-card p-4 text-muted-foreground">
            <MessageCircle className="size-5" />
            <span className="h-1.5 w-24 rounded-full bg-muted-foreground/30" />
          </div>
          <div className="flex items-center gap-3 self-end rounded-2xl rounded-br-sm border border-primary/30 bg-primary/10 p-4 text-primary">
            <span className="h-1.5 w-24 rounded-full bg-primary/40" />
            <Send className="size-5" />
          </div>
        </div>
      ) : kind === "support" ? (
        <div className="flex items-center gap-4">
          <div className="flex size-20 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-primary">
            <Gift className="size-9" strokeWidth={1.5} />
          </div>
          <div className="flex flex-col gap-2 text-muted-foreground">
            <span className="text-4xl font-medium tracking-tight text-foreground">
              2
            </span>
            <span className="text-sm">месяца рядом</span>
          </div>
        </div>
      ) : kind === "ads" ? (
        <div className="flex items-center gap-4 text-muted-foreground">
          <div className="flex size-16 items-center justify-center rounded-2xl border border-border bg-card">
            <MousePointer2 className="size-7" strokeWidth={1.5} />
          </div>
          <ArrowRight className="size-4" />
          <div className="flex size-20 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-primary">
            <ChartNoAxesCombined className="size-9" strokeWidth={1.5} />
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-4 text-muted-foreground">
          <div className="flex size-16 items-center justify-center rounded-2xl border border-border bg-card">
            <SlidersHorizontal className="size-7" strokeWidth={1.5} />
          </div>
          <span className="h-px w-5 bg-border" />
          <div className="flex size-20 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-primary">
            <Workflow className="size-9" strokeWidth={1.5} />
          </div>
        </div>
      )}
    </div>
  )
}

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
      >
        Почему PulsarWeb
      </h2>
      <div className="grid gap-6 lg:grid-cols-6">
        {benefits.map((benefit, index) => (
          <article
            className={cn(
              "min-w-0",
              index < 3 ? "lg:col-span-2" : "lg:col-span-3"
            )}
            key={benefit.visual}
            aria-labelledby={`benefit-${index}`}
          >
            <Card className="h-full gap-5 rounded-3xl pt-0 ring-0 sm:rounded-[2rem]">
              <BenefitVisual kind={benefit.visual} />
              <CardHeader>
                <CardTitle>
                  <h3
                    id={`benefit-${index}`}
                    className="text-2xl tracking-tight"
                  >
                    {benefit.title}
                  </h3>
                </CardTitle>
                <CardDescription className="leading-relaxed">
                  {benefit.text}
                </CardDescription>
              </CardHeader>
            </Card>
          </article>
        ))}
      </div>
      <section
        aria-labelledby="home-cta-title"
        className="mt-20 flex flex-col items-center gap-6 text-center md:mt-28"
      >
        <div className="flex flex-col items-center gap-4">
          <h2 id="home-cta-title" className="home-section-title text-balance">
            Обсудим ваш проект?
          </h2>
          <p className="max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Расскажите о задаче. Обсудим, что нужно бизнесу, и предложим
            понятный следующий шаг.
          </p>
        </div>
        <ButtonLink href="/start" className="min-h-12 w-full px-5 sm:w-auto">
          Обсудить проект{" "}
          <ArrowUpRight data-icon="inline-end" aria-hidden="true" />
        </ButtonLink>
      </section>
    </Section>
  )
}

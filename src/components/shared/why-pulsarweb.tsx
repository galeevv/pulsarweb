import Image from "next/image"
import { ArrowUpRight } from "lucide-react"
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
      className="relative flex aspect-[2/1] max-h-56 items-center justify-center overflow-hidden rounded-3xl bg-background/50 sm:rounded-[2rem]"
    >
      <Image
        src={`/images/benefits/${kind}.webp`}
        alt=""
        fill
        sizes="(max-width: 639px) 100vw, 420px"
        className="object-contain px-8 py-4 sm:px-10 sm:py-5"
      />
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

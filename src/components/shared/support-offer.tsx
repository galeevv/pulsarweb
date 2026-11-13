import { ArrowUpRight, RefreshCw, ShieldCheck, Blocks } from "lucide-react"
import { Section } from "@/components/layout/section"
import { ButtonLink } from "@/components/shared/button-link"

const items = [
  {
    icon: ShieldCheck,
    title: "Работоспособность",
    text: "Проверки ключевых сценариев, разбор ошибок и восстановление работы.",
  },
  {
    icon: RefreshCw,
    title: "Обновления",
    text: "Обновление зависимостей и интеграций с проверкой после изменений.",
  },
  {
    icon: Blocks,
    title: "Развитие",
    text: "Новые страницы, функции и улучшения по мере появления задач.",
  },
]

export function SupportOffer() {
  return (
    <Section id="support" aria-labelledby="support-title">
      <div className="mb-10 grid gap-6 lg:grid-cols-2 lg:gap-20">
        <div>
          <p className="eyebrow mb-6">После запуска</p>
          <h2
            id="support-title"
            className="max-w-lg text-3xl leading-tight font-medium tracking-tight sm:text-5xl"
          >
            Проект живёт дальше. Мы остаёмся рядом.
          </h2>
        </div>
        <div className="flex flex-col items-start gap-5 lg:pt-10">
          <p className="max-w-xl leading-relaxed text-muted-foreground">
            Сопровождение и развитие прежде всего для проектов PulsarWeb. Чтобы
            сайт оставался рабочим, а новые задачи не требовали начинать всё
            сначала.
          </p>
          <p className="text-sm text-muted-foreground">
            Отдельная услуга по желанию. Объём работ, сроки реакции и стоимость
            согласуем заранее.
          </p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {items.map(({ icon: Icon, title, text }) => (
          <article
            key={title}
            className="flex flex-col gap-5 rounded-3xl border border-border/70 bg-muted/30 p-6 sm:p-8"
          >
            <Icon className="size-6" aria-hidden="true" strokeWidth={1.5} />
            <h3 className="text-xl font-medium tracking-tight">{title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {text}
            </p>
          </article>
        ))}
      </div>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <ButtonLink href="/start?service=support" className="h-12">
          Обсудить сопровождение <ArrowUpRight data-icon="inline-end" />
        </ButtonLink>
      </div>
    </Section>
  )
}

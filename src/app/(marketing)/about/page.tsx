import { ArrowUpRight, MessagesSquare, Layers3, Settings2 } from "lucide-react"
import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"
import { ButtonLink } from "@/components/shared/button-link"
import { CTA } from "@/components/shared/cta"
import { PulsarMark } from "@/components/shared/logo"
import { Separator } from "@/components/ui/separator"
import { pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata(
  "О студии",
  "PulsarWeb — независимая студия разработки. Прямое общение с разработчиком, полный технический цикл и опыт собственных продуктов.",
  "/about"
)

const approach = [
  {
    icon: MessagesSquare,
    title: "Прямое общение",
    description:
      "Обсуждаете задачу с человеком, который проектирует и разрабатывает продукт. Решения, вопросы и обратная связь — в одном диалоге.",
  },
  {
    icon: Layers3,
    title: "Весь проект в одних руках",
    description:
      "Интерфейс, серверная логика, данные и интеграции проектируются вместе. Можем взять на себя весь технический цикл, включая домен, сервер и публикацию.",
  },
  {
    icon: Settings2,
    title: "С расчётом на развитие",
    description:
      "Учитываем будущие изменения и эксплуатацию ещё при разработке. После запуска можем продолжить обслуживание и развитие на отдельно согласованных условиях.",
  },
]

export default function AboutPage() {
  return (
    <>
      <Container>
        <section
          aria-labelledby="about-title"
          className="py-16 md:py-24 lg:py-32"
        >
          <p className="eyebrow mb-8">О PulsarWeb</p>
          <h1
            id="about-title"
            className="max-w-4xl text-[clamp(2.5rem,5vw,5rem)] leading-[1.06] font-medium tracking-[-0.055em] hyphens-none"
          >
            Напрямую с тем,
            <br className="hidden sm:block" /> кто разрабатывает.
          </h1>
          <div className="mt-10 grid gap-8 md:mt-14 lg:grid-cols-[1fr_1.2fr] lg:gap-24">
            <p className="max-w-sm text-xl leading-relaxed tracking-tight md:text-2xl">
              Небольшая независимая студия.
              <br /> Полный технический цикл.
            </p>
            <div className="flex flex-col items-start gap-6">
              <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
                Создаём сайты, внутренние системы и автоматизацию для бизнеса.
                Помогаем пройти путь от общей идеи до продукта, которым можно
                пользоваться каждый день.
              </p>
              <ButtonLink href="/contacts" variant="outline">
                Обсудить проект{" "}
                <ArrowUpRight data-icon="inline-end" aria-hidden="true" />
              </ButtonLink>
            </div>
          </div>
        </section>
      </Container>

      <Section className="bg-muted/40">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
          <div className="flex flex-col gap-6">
            <p className="eyebrow">Формат работы</p>
            <h2 className="max-w-sm text-3xl leading-tight font-medium tracking-tight md:text-5xl">
              Ближе к задаче.
              <br /> На каждом этапе.
            </h2>
          </div>
          <div className="flex flex-col gap-8">
            {approach.map(({ icon: Icon, title, description }, index) => (
              <div key={title}>
                {index > 0 && <Separator className="mb-8" />}
                <article className="flex items-start gap-5">
                  <Icon
                    className="mt-1 size-6 shrink-0 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <div className="flex flex-col gap-3">
                    <h3 className="text-xl font-medium tracking-tight">
                      {title}
                    </h3>
                    <p className="leading-relaxed text-muted-foreground">
                      {description}
                    </p>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-24">
          <div
            aria-hidden="true"
            className="flex aspect-square max-h-96 items-center justify-center rounded-3xl bg-primary text-primary-foreground"
          >
            <PulsarMark size={240} className="size-1/2" />
          </div>
          <div className="flex flex-col items-start gap-6">
            <p className="eyebrow">Собственный опыт</p>
            <h2 className="text-3xl leading-tight font-medium tracking-tight md:text-5xl">
              Создаём продукты.
              <br /> И работаем с ними дальше.
            </h2>
            <p className="leading-relaxed text-muted-foreground">
              Pulsar Cloud — собственный проект PulsarWeb. Опыт его разработки и
              эксплуатации помогает учитывать то, что происходит с системой
              после запуска: обновления, поддержку и новые задачи.
            </p>
            <ButtonLink href="/projects" variant="outline">
              Посмотреть проекты{" "}
              <ArrowUpRight data-icon="inline-end" aria-hidden="true" />
            </ButtonLink>
          </div>
        </div>
      </Section>

      <CTA
        title="Начнём с вашей задачи."
        description="Готовое техническое задание не требуется. Коротко опишите идею — уточним детали в переписке, а при необходимости договоримся о созвоне."
        className="bg-muted/40"
      />
    </>
  )
}

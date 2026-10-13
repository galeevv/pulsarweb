import { ArrowUpRight } from "lucide-react"

import { Section } from "@/components/layout/section"
import { ButtonLink } from "@/components/shared/button-link"
import { CTA } from "@/components/shared/cta"
import { PageHeader } from "@/components/shared/page-header"
import { SectionHeader } from "@/components/shared/section-header"
import { ServiceList } from "@/components/shared/service-list"
import { pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata(
  "Услуги",
  "Разработка сайтов, web-систем, Telegram-автоматизации и desktop-приложений. Инфраструктура, запуск и сопровождение цифровых продуктов.",
  "/services"
)

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Наши направления"
        title="От первой задачи до работающего продукта."
        description="Подключимся на нужном этапе или возьмём весь технический цикл: проектирование, разработку, интеграции, запуск и сопровождение."
      />
      <Section className="pt-4 md:pt-4" aria-label="Направления разработки">
        <ServiceList />
      </Section>
      <Section className="bg-muted/40">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-20">
          <SectionHeader
            eyebrow="Связанные сервисы"
            title="Интегрируем то, чем вы уже пользуетесь."
            description="CRM, платежи, email, Telegram и внутренние API становятся частью одного сценария. Подбираем интеграции под задачу и ограничения вашего продукта."
          />
          <div className="flex flex-col items-start gap-8 lg:pt-10">
            <p className="text-xl leading-relaxed tracking-tight md:text-2xl">
              Заявка с сайта попадает в систему учёта. Команда получает
              уведомление. Клиент видит следующий шаг.
            </p>
            <p className="max-w-lg leading-relaxed text-muted-foreground">
              Заранее продумываем обработку ошибок, повторные запросы и доступ к
              данным, чтобы связь между сервисами была предсказуемой.
            </p>
            <ButtonLink href="/contacts" variant="outline">
              Обсудить интеграцию <ArrowUpRight data-icon="inline-end" />
            </ButtonLink>
          </div>
        </div>
      </Section>
      <CTA
        title="Начнём с вашей задачи."
        description="Необязательно заранее выбирать технологию или направление. Опишите текущий процесс и результат, который хотите получить."
      />
    </>
  )
}

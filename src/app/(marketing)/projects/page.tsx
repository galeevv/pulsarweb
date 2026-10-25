import { Section } from "@/components/layout/section"
import { CTA } from "@/components/shared/cta"
import { PageHeader } from "@/components/shared/page-header"
import { LatestProjects } from "@/components/shared/latest-projects"
import { pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata(
  "Проекты",
  "Проекты PulsarWeb: действующий сервис Pulsar VPN и дизайн-концепт FORM.",
  "/projects"
)

export default function ProjectsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Выбранные проекты"
        title="Продукты, за которыми стоит инженерная работа."
        description="Действующий сервис Pulsar VPN и визуальное исследование FORM. Реальные продукты и концепты с прозрачным статусом."
      />
      <Section className="pt-4 md:pt-4">
        <LatestProjects />
      </Section>
      <CTA
        title="Следующий проект — ваш?"
        description="Расскажите, какой продукт нужен бизнесу. Обсудим первую версию, ограничения и путь к запуску."
      />
    </>
  )
}

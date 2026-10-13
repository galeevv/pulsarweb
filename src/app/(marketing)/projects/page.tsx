import { Section } from "@/components/layout/section"
import { CTA } from "@/components/shared/cta"
import { PageHeader } from "@/components/shared/page-header"
import { ProjectPreview } from "@/components/shared/project-preview"
import { pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata(
  "Проекты",
  "Проекты PulsarWeb. Pulsar Cloud / Pulsar VPN — первый проект студии, для которого готовится технический разбор.",
  "/projects"
)

export default function ProjectsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Выбранные проекты"
        title="Продукты, за которыми стоит инженерная работа."
        description="Разбираем задачи, принятые решения и то, как устроен продукт после запуска. Первый проект — Pulsar Cloud / Pulsar VPN."
      />
      <Section className="pt-4 md:pt-4">
        <ProjectPreview />
        <p className="mt-8 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Подробный кейс готовится к публикации. Технические детали, интерфейсы
          и результаты появятся после проверки материалов проекта.
        </p>
      </Section>
      <CTA
        title="Следующий проект — ваш?"
        description="Расскажите, какой продукт нужен бизнесу. Обсудим первую версию, ограничения и путь к запуску."
      />
    </>
  )
}

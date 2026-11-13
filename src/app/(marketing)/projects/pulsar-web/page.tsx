import Image from "next/image"
import { Section } from "@/components/layout/section"
import { PageHeader } from "@/components/shared/page-header"
import { ButtonLink } from "@/components/shared/button-link"
import { CTA } from "@/components/shared/cta"
import { Badge } from "@/components/ui/badge"
import { pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata(
  "PULSAR WEB — сайт студии",
  "Собственный сайт PulsarWeb: дизайн-система, каталог услуг, портфолио и пошаговая заявка на проект.",
  "/projects/pulsar-web"
)

export default function PulsarWebProjectPage() {
  return (
    <>
      <PageHeader
        eyebrow="Сайт студии / Собственный проект"
        title="PULSAR WEB"
        description="Наш собственный сайт: рассказываем об услугах, показываем проекты и помогаем сформулировать задачу для разработки."
      />
      <Section className="pt-0 md:pt-0">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <Badge variant="secondary">Свой проект</Badge>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/" className="h-12">
              Открыть сайт
            </ButtonLink>
            <ButtonLink href="/projects" variant="outline" className="h-12">
              Все проекты
            </ButtonLink>
          </div>
        </div>
        <Image
          src="/images/projects/pulsar-web-16x9.webp"
          alt="Первый экран сайта PulsarWeb на ноутбуке: тёмный фон, крупный заголовок и синие кнопки."
          width={1600}
          height={900}
          sizes="(max-width: 680px) 100vw, 1400px"
          className="aspect-video w-full rounded-3xl object-cover sm:rounded-[2rem]"
        />
        <p className="mt-4 text-sm text-muted-foreground">
          Собственный проект студии. Обложка создана на основе скриншота
          действующего интерфейса; устройство и окружение — 3D-визуализация.
        </p>
      </Section>
      <Section className="dark home-dark-panel text-foreground">
        <div className="grid gap-10 md:grid-cols-3">
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-medium">Задача</h2>
            <p className="leading-relaxed text-muted-foreground">
              Объяснить, что делает студия и как проходит работа. Объединить
              услуги, проекты и заявку в понятный путь для будущего клиента.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-medium">Дизайн</h2>
            <p className="leading-relaxed text-muted-foreground">
              Тёмная нейтральная палитра, синие акценты и крупная типографика.
              Единая система карточек, предметные мокапы проектов и объёмные
              иллюстрации дополняют содержание.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-medium">Реализация</h2>
            <p className="leading-relaxed text-muted-foreground">
              Адаптивный сайт на Next.js: каталог услуг, отдельные страницы
              проектов, пошаговая заявка и подготовленные метаданные для
              поисковых систем.
            </p>
          </div>
        </div>
      </Section>
      <CTA
        title="Сайт для вашего бизнеса"
        description="Обсудим задачу, продумаем структуру и создадим сайт, который понятно представляет ваш продукт."
      />
    </>
  )
}

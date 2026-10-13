import { ArrowLeft, ArrowUpRight, Images } from "lucide-react"
import Link from "next/link"
import { ProjectCover } from "@/components/shared/project-cover"
import { pulsarCloud } from "@/config/projects"

import { Section } from "@/components/layout/section"
import { ButtonLink } from "@/components/shared/button-link"
import { CTA } from "@/components/shared/cta"
import { PageHeader } from "@/components/shared/page-header"
import { SectionHeader } from "@/components/shared/section-header"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyMedia,
} from "@/components/ui/empty"
import { pageMetadata } from "@/lib/seo"

export const metadata = {
  ...pageMetadata(
    "Pulsar Cloud / Pulsar VPN",
    "Pulsar Cloud / Pulsar VPN — первый проект PulsarWeb. Страница проекта и структура будущего технического кейса.",
    "/projects/pulsar-cloud"
  ),
  robots: { index: pulsarCloud.casePublished, follow: true },
}

const caseSections = [
  {
    title: "Задача",
    description:
      "Исходные сценарии пользователей, ограничения и требования к продукту.",
  },
  {
    title: "Решение",
    description: "Принятые решения и причины выбора архитектуры.",
  },
  {
    title: "Что реализовано",
    description:
      "Подтверждённый состав функций и границы ответственности студии.",
  },
  {
    title: "Инфраструктура",
    description:
      "Развёртывание, эксплуатация, резервное копирование и наблюдение за сервисом.",
  },
  {
    title: "Интеграции",
    description: "Внешние сервисы и ключевые сценарии обмена данными.",
  },
  {
    title: "Технологии",
    description: "Фактический стек проекта и технические ограничения.",
  },
]

export default function PulsarCloudPage() {
  return (
    <>
      <PageHeader
        eyebrow="Проект / 01"
        title="Pulsar Cloud."
        description="Первый проект в портфолио студии. Также известен как Pulsar VPN."
      />
      <Section className="pt-0 md:pt-0">
        <div className="mb-10 flex flex-wrap items-center justify-between gap-6">
          <Badge variant="secondary">{pulsarCloud.status}</Badge>
          <ButtonLink href="/projects" variant="ghost">
            <ArrowLeft data-icon="inline-start" /> Все проекты
          </ButtonLink>
        </div>
        <figure>
          <ProjectCover />
          <figcaption className="mt-4 text-xs leading-relaxed text-muted-foreground">
            Графическая обложка проекта. Не является скриншотом интерфейса.
          </figcaption>
        </figure>
        <nav
          aria-label="Разделы кейса"
          className="mt-10 flex flex-wrap gap-x-8 gap-y-4"
        >
          {[
            ["overview", "Обзор"],
            ["details", "Технический разбор"],
            ["screens", "Интерфейсы и результат"],
          ].map(([id, label]) => (
            <Link
              key={id}
              href={`#${id}`}
              className="inline-flex min-h-11 items-center text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              {label}
            </Link>
          ))}
        </nav>
      </Section>
      <Separator />
      <Section id="overview">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-24">
          <SectionHeader
            eyebrow="Обзор"
            title="От проекта к подробному разбору."
          />
          <div className="flex flex-col gap-6 lg:pt-10">
            <p className="text-xl leading-relaxed tracking-tight">
              Для полного кейса собираем и проверяем материалы: исходную задачу,
              реализованные сценарии и технические решения.
            </p>
            <p className="leading-relaxed text-muted-foreground">
              На этой странице появится разбор продукта. Состав функций, стек,
              сроки и результаты пока не опубликованы: для них нужны
              подтверждённые данные проекта.
            </p>
          </div>
        </div>
      </Section>
      <Section id="details" className="bg-muted/40">
        <SectionHeader
          eyebrow="Технический кейс"
          title="Что войдёт в разбор."
          description="Структура будущей публикации. Содержание разделов будет дополнено по материалам проекта."
        />
        <div className="grid gap-x-16 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
          {caseSections.map((section, index) => (
            <article key={section.title} className="flex flex-col gap-5">
              <p
                className="font-mono text-xs text-muted-foreground"
                aria-hidden="true"
              >
                0{index + 1}
              </p>
              <Separator />
              <h3 className="text-xl font-medium tracking-tight">
                {section.title}
              </h3>
              <p className="leading-relaxed text-muted-foreground">
                {section.description}
              </p>
            </article>
          ))}
        </div>
      </Section>
      <Section id="screens">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-24">
          <div className="flex flex-col gap-5">
            <p className="eyebrow">Интерфейсы</p>
            <h2 className="text-3xl font-medium tracking-tight">
              Экраны с контекстом.
            </h2>
            <Empty className="border px-6 py-10">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Images aria-hidden="true" />
                </EmptyMedia>
                <EmptyTitle>Скриншоты ещё не опубликованы</EmptyTitle>
                <EmptyDescription>
                  Добавим реальные экраны и описание сценариев после проверки
                  материалов проекта.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          </div>
          <div className="flex flex-col items-start gap-5">
            <p className="eyebrow">Результат</p>
            <h2 className="text-3xl font-medium tracking-tight">
              Подтверждённые факты.
            </h2>
            <p className="max-w-lg leading-relaxed text-muted-foreground">
              Итоги реализации и доступные измерения появятся вместе с полным
              кейсом. Число пользователей, выручка и показатели доступности
              сейчас не заявляются.
            </p>
            <ButtonLink href="/contacts" variant="outline">
              Обсудить похожую задачу <ArrowUpRight data-icon="inline-end" />
            </ButtonLink>
          </div>
        </div>
      </Section>
      <CTA />
    </>
  )
}

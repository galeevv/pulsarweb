import Image from "next/image"
import { ArrowUpRight, Check, Database, ImageIcon, PanelsTopLeft, Plug } from "lucide-react"
import { Section } from "@/components/layout/section"
import { ButtonLink } from "@/components/shared/button-link"
import { HomeHeroSurface } from "@/components/shared/home-hero-surface"
import { Separator } from "@/components/ui/separator"
import { pageMetadata } from "@/lib/seo"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

export const metadata = pageMetadata(
  "PULSAR WEB",
  "Сайт студии PulsarWeb: услуги, портфолио и пошаговая заявка на проект.",
  "/projects/pulsar-web"
)

function MediaPlaceholder({ label, ratio }: { label: string; ratio: string }) {
  return (
    <div className={cn("relative flex min-w-0 flex-col items-center justify-center gap-3 overflow-hidden rounded-3xl bg-background/50 p-6 text-center sm:rounded-[2rem]", ratio)}>
      <ImageIcon className="size-7 text-muted-foreground" aria-hidden="true" />
      <p className="text-sm font-medium">{label}</p>
      <p className="text-xs text-muted-foreground">Место для изображения</p>
    </div>
  )
}

const screens = [
  { name: "Главная", caption: "Знакомство со студией: услуги, подход к работе и избранные проекты." },
  { name: "Страницы услуг", caption: "Что входит в работу, сколько стоит запуск и с чего начать." },
  { name: "Проекты", caption: "Интерфейсы, дизайн-система и технологии — на примере наших работ." },
  { name: "Заявка на проект", caption: "Пошаговая форма помогает выбрать услугу, описать задачу и оставить контакты." },
]

const stack = [
  { title: "Интерфейс", icon: PanelsTopLeft, items: ["Next.js · React · TypeScript", "Tailwind CSS", "shadcn/ui · Base UI"] },
  { title: "Сервер и данные", icon: Database, items: ["Node.js", "Prisma · SQLite", "Zod"] },
  { title: "Возможности", icon: Plug, items: ["Telegram · уведомления", "UTM · источники заявок", "Three.js · декоративный фон"] },
]

export default function PulsarWebProjectPage() {
  return (
    <>
      <Section className="pt-6 pb-0 md:pt-10 md:pb-0" aria-labelledby="project-title">
        <Card className="gap-4 rounded-3xl bg-muted pt-0 ring-0 sm:rounded-[2rem]">
          <Image
            src="/images/projects/pulsar-web-16x9.webp"
            alt="Сайт PulsarWeb на ноутбуке: тёмный интерфейс и синие акценты."
            width={1600}
            height={900}
            sizes="(max-width: 768px) 100vw, 1400px"
            className="aspect-[21/9] w-full rounded-3xl object-cover sm:rounded-[2rem]"
          />
          <CardHeader className="gap-4">
            <CardTitle><h1 id="project-title" className="home-section-title">PULSAR WEB</h1></CardTitle>
            <CardDescription className="max-w-2xl text-base leading-relaxed sm:text-lg">Сайт нашей студии: услуги, проекты и простой путь от идеи до заявки на разработку.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">Сайт студии</Badge>
              <Badge variant="outline">Собственный проект</Badge>
            </div>
            <ButtonLink href="/" className="h-12 w-full shrink-0 px-6 md:w-auto">
              Открыть сайт <ArrowUpRight data-icon="inline-end" aria-hidden="true" />
            </ButtonLink>
          </CardContent>
        </Card>
      </Section>

      <Section aria-labelledby="project-about">
        <h2 id="project-about" className="home-section-title mb-10 md:mb-12">Что сделали</h2>
        <Separator />
        <div className="grid gap-8 py-8 md:py-10 lg:grid-cols-3 lg:gap-10">
          {[
            { title: "Интерфейс", items: ["Дизайн-система и адаптивная вёрстка", "Иллюстрации и обложки", "Единый стиль страниц"] },
            { title: "Содержание", items: ["Каталог услуг", "Портфолио и страницы проектов", "Описание подхода студии"] },
            { title: "Заявки", items: ["Пошаговый бриф", "Сохранение заявок в базе", "UTM и уведомления в Telegram"] },
          ].map((group) => (
            <div key={group.title} className="flex flex-col gap-5">
              <h3 className="text-xl font-medium tracking-tight">{group.title}</h3>
              <ul className="flex flex-col gap-3">
                {group.items.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                    <Check aria-hidden="true" className="mt-1 size-4 shrink-0" /><span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <Separator />
      </Section>

      <Section className="pt-0 md:pt-0" aria-label="Цветовая палитра PulsarWeb">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
          {[
            { color: "#0071E3", label: "Акцентный цвет" },
            { color: "#A1A1A1", label: "Вторичный текст" },
            { color: "#121212", label: "Карточки" },
            { color: "#0A0A0A", label: "Основной фон" },
          ].map(({ color, label }) => (
            <div key={color} className="flex flex-col gap-3">
              <div className="h-24 rounded-2xl border border-border sm:h-32" style={{ backgroundColor: color }} aria-hidden="true" />
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium">{label}</p>
                <p className="font-mono text-xs text-muted-foreground">{color}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section className="pt-0 md:pt-0" aria-labelledby="project-screens">
        <h2 id="project-screens" className="home-section-title mb-12 md:mb-16">Интерфейс</h2>
        {screens.map((screen, index) => (
          <article key={screen.name} className="home-service-panel" aria-labelledby={`project-screen-${index}`}>
            <Separator />
            <div className="grid items-stretch gap-8 py-10 lg:grid-cols-2 lg:gap-12 lg:py-12">
              <MediaPlaceholder label={screen.name} ratio="aspect-[3/2] self-start" />
              <div className="flex min-w-0 flex-col items-start justify-center gap-5">
                <h3 id={`project-screen-${index}`} className="text-3xl font-medium tracking-tight sm:text-4xl lg:text-5xl">{screen.name}</h3>
                <p className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">{screen.caption}</p>
              </div>
            </div>
          </article>
        ))}
      </Section>

      <Section className="pt-0 md:pt-0" aria-labelledby="project-stack">
        <h2 id="project-stack" className="text-3xl font-medium tracking-tight sm:text-4xl">Технологии и сервисы</h2>
        <div className="mt-8 grid gap-8 lg:grid-cols-3 lg:gap-10">
          {stack.map((group) => (
            <div key={group.title} className="flex min-w-0 flex-col gap-5">
              <Separator />
              <h3 className="flex items-center gap-3 text-xl font-medium tracking-tight">
                <group.icon className="size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
                {group.title}
              </h3>
              <ul className="flex flex-col gap-3 text-base leading-relaxed text-muted-foreground">
                {group.items.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section className="pt-0 md:pt-0" aria-labelledby="project-cta">
        <div className="overflow-hidden rounded-3xl bg-card sm:rounded-[2rem]">
          <HomeHeroSurface>
            <div className="flex flex-col items-start gap-5 bg-linear-to-r from-card via-card/90 to-transparent px-6 py-10 sm:p-12">
              <h2 id="project-cta" className="max-w-xl text-3xl font-medium tracking-tight sm:text-4xl">Ваш сайт — следующий.</h2>
              <p className="max-w-lg text-muted-foreground">Обсудим задачу, структуру и запуск сайта для вашего бизнеса.</p>
              <ButtonLink href="/start?service=other&source=%2Fprojects%2Fpulsar-web" className="h-12 w-full sm:w-auto">Обсудить проект <ArrowUpRight data-icon="inline-end" aria-hidden="true" /></ButtonLink>
            </div>
          </HomeHeroSurface>
        </div>
      </Section>
    </>
  )
}

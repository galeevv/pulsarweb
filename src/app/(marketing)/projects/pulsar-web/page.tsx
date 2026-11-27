import { ProjectPageTemplate } from "@/components/shared/project-page-template"
import Image from "next/image"
import { ArrowUpRight, Database, PanelsTopLeft, Plug } from "lucide-react"
import { Section } from "@/components/layout/section"
import { ButtonLink } from "@/components/shared/button-link"
import { HomeHeroSurface } from "@/components/shared/home-hero-surface"
import { pageMetadata } from "@/lib/seo"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

export const metadata = pageMetadata(
  "PULSAR WEB",
  "Сайт студии PulsarWeb: услуги, портфолио и пошаговая заявка на проект.",
  "/projects/pulsar-web"
)

const screens = [
  {
    name: "Главная",
    caption: "Знакомство со студией: услуги, подход к работе и избранные проекты.",
    image: {
      src: "/images/projects/pulsar-web/screens/home.webp",
      alt: "Главная страница PulsarWeb",
    },
  },
  {
    name: "Каталог услуг",
    caption: "Все направления разработки и сопровождения в одном месте.",
    image: {
      src: "/images/projects/pulsar-web/screens/services.webp",
      alt: "Каталог услуг PulsarWeb",
    },
  },
  {
    name: "Страница услуг",
    caption: "Типовая страница с описанием направления, составом работ и переходом к заявке.",
    image: {
      src: "/images/projects/pulsar-web/screens/landing-pages.webp",
      alt: "Страница услуги «Лендинги под рекламу»",
    },
  },
  {
    name: "Каталог проектов",
    caption: "Каталог кейсов студии.",
    image: {
      src: "/images/projects/pulsar-web/screens/projects.webp",
      alt: "Каталог проектов PulsarWeb",
    },
  },
  {
    name: "Страница проекта",
    caption: "Типовая страница кейса с описанием задачи, интерфейсом и технологиями.",
    image: {
      src: "/images/projects/pulsar-web/screens/pulsar-vpn.webp",
      alt: "Страница кейса PULSAR VPN",
    },
  },
  {
    name: "О студии",
    caption: "Подход к работе, технологии и сервисы студии.",
    image: {
      src: "/images/projects/pulsar-web/screens/about.webp",
      alt: "Страница о студии PulsarWeb",
    },
  },
  {
    name: "Контакты",
    caption: "Быстрый переход в Telegram или к заявке на проект.",
    image: {
      src: "/images/projects/pulsar-web/screens/contacts.webp",
      alt: "Страница контактов PulsarWeb",
    },
  },
  {
    name: "Заявка на проект",
    caption: "Вход в пошаговую форму для нового проекта или сопровождения.",
    image: {
      src: "/images/projects/pulsar-web/screens/start.webp",
      alt: "Форма заявки на проект",
    },
  },
  {
    name: "Правовая информация",
    caption: "Политика обработки персональных данных, согласие на их обработку и политика использования cookie.",
    image: {
      src: "/images/projects/pulsar-web/screens/legal.webp",
      alt: "Правовые документы PulsarWeb",
    },
  },
]

const stack = [
  { title: "Интерфейс", icon: PanelsTopLeft, items: ["Next.js · React · TypeScript", "Tailwind CSS", "shadcn/ui · Base UI"] },
  { title: "Сервер и данные", icon: Database, items: ["Node.js", "Prisma · SQLite", "Zod"] },
  { title: "Возможности", icon: Plug, items: ["Telegram · уведомления", "UTM · источники заявок", "Three.js · декоративный фон"] },
]

export default function PulsarWebProjectPage() {
  return (
    <ProjectPageTemplate screens={screens} stack={stack}
      about={[
            { title: "Интерфейс", items: ["Дизайн-система и адаптивная вёрстка", "Иллюстрации и обложки", "Единый стиль страниц"] },
            { title: "Содержание", items: ["Каталог услуг", "Портфолио и страницы проектов", "Описание подхода студии"] },
            { title: "Заявки", items: ["Пошаговый бриф", "Сохранение заявок в базе", "UTM и уведомления в Telegram"] },
          ]}
      palette={[
            { color: "#0071E3", label: "Акцентный цвет" },
            { color: "#A1A1A1", label: "Вторичный текст" },
            { color: "#121212", label: "Карточки" },
            { color: "#0A0A0A", label: "Основной фон" },
          ]}
      hero={<Section className="pt-6 pb-0 md:pt-10 md:pb-0" aria-labelledby="project-title">
        <Card className="gap-4 marketing-surface bg-muted pt-0 ring-0">
          <Image
            src="/images/projects/pulsar-web/cover-card.webp"
            alt="Сайт PulsarWeb на ноутбуке: тёмный интерфейс и синие акценты."
            width={6000}
            height={4500}
            sizes="(max-width: 768px) 100vw, 1400px"
            className="aspect-[21/9] w-full rounded-3xl object-cover sm:rounded-[2rem]"
          />
          <CardHeader className="gap-4">
            <CardTitle><h1 id="project-title" className="home-section-title">PULSAR WEB</h1></CardTitle>
            <CardDescription className="max-w-2xl text-base leading-relaxed sm:text-lg">Сайт студии: услуги, проекты и удобный путь от знакомства до заявки.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">Сайт студии</Badge>
              <Badge variant="outline">Собственный проект</Badge>
            </div>
            <ButtonLink href="/" className="w-full shrink-0 md:w-auto">
              Открыть сайт <ArrowUpRight data-icon="inline-end" aria-hidden="true" />
            </ButtonLink>
          </CardContent>
        </Card>
      </Section>}
      cta={<Section className="pt-0 md:pt-0" aria-labelledby="project-cta">
        <div className="overflow-hidden marketing-surface bg-card">
          <HomeHeroSurface>
            <div className="flex flex-col items-start gap-5 bg-linear-to-r from-card via-card/90 to-transparent px-6 py-10 sm:p-12">
              <h2 id="project-cta" className="max-w-xl text-3xl font-medium tracking-tight sm:text-4xl">Ваш сайт — следующий.</h2>
              <p className="max-w-lg text-muted-foreground">Обсудим задачу, структуру и запуск сайта для вашего бизнеса.</p>
              <ButtonLink href="/start?service=other&source=%2Fprojects%2Fpulsar-web" className="w-full sm:w-auto">Обсудить проект </ButtonLink>
            </div>
          </HomeHeroSurface>
        </div>
      </Section>}
    />
  )
}

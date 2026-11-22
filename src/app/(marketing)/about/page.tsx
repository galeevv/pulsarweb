import { ArrowUpRight } from "lucide-react"
import { MarketingHero } from "@/components/shared/marketing-hero"
import { ButtonLink } from "@/components/shared/button-link"
import { HomeBadge } from "@/components/shared/home-badge"
import { Separator } from "@/components/ui/separator"
import { pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata(
  "О студии",
  "PulsarWeb — небольшая web/software-студия. Создаём сайты, интернет-магазины и Telegram-продукты для бизнеса — от идеи до запуска.",
  "/about"
)

const technologies = [
  "Next.js",
  "React",
  "TypeScript",
  "Tailwind CSS",
  "shadcn/ui",
  "Prisma",
  "PostgreSQL",
  "Docker",
  "Telegram",
  "Resend",
]
const benefits = [
  { title: "Прямой контакт", description: "Общение с разработчиком" },
  { title: "Веб-аналитика", description: "Метрика и цели" },
  { title: "Запуск", description: "На вашем домене" },
  { title: "Поддержка", description: "Два месяца включены" },
]

export default function AboutPage() {
  return (
    <MarketingHero labelledBy="about-title">
      <div className="flex w-full flex-col items-center gap-8 text-center">
        <HomeBadge large>О студии</HomeBadge>
        <h1
          id="about-title"
          className="home-hero-title break-normal hyphens-none"
        >
          PulsarWeb — небольшая web/software-студия
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Создаём сайты, интернет-магазины и Telegram-продукты для бизнеса — от
          идеи до запуска.
        </p>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <ButtonLink href="/start" className="h-12 px-5">
            Обсудить проект{" "}
            <ArrowUpRight data-icon="inline-end" aria-hidden="true" />
          </ButtonLink>
          <ButtonLink href="/projects" variant="outline" className="h-12 px-5">
            Наши проекты{" "}
            <ArrowUpRight data-icon="inline-end" aria-hidden="true" />
          </ButtonLink>
        </div>
        <div className="mt-6 flex max-w-4xl flex-col gap-5 md:mt-10">
          <h2 className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
            Технологии и сервисы
          </h2>
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm text-muted-foreground sm:text-base">
            {technologies.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        </div>
        <div className="mt-4 w-full md:mt-8">
          <Separator />
          <dl className="grid grid-cols-1 gap-8 py-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-border">
            {benefits.map(({ title, description }) => (
              <div key={title} className="flex min-w-0 flex-col gap-2 px-4">
                <dt className="text-2xl font-medium tracking-tight">{title}</dt>
                <dd className="text-sm text-muted-foreground">{description}</dd>
              </div>
            ))}
          </dl>
          <Separator />
        </div>
      </div>
    </MarketingHero>
  )
}

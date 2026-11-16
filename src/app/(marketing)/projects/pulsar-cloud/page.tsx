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
  "PULSAR VPN",
  "VPN-сервис с личным кабинетом, управлением подпиской, устройствами и поддержкой.",
  "/projects/pulsar-cloud"
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
  { name: "Вход в аккаунт", caption: "Авторизация через Telegram или email с подтверждением кода — без отдельного пароля." },
  { name: "Главная и покупка подписки", caption: "Статус доступа и оформление подписки: срок, устройства и Plus на одном экране." },
  { name: "Подписка и устройства", caption: "Ссылка подключения, инструкция и управление доступными местами." },
  { name: "Реферальная программа", caption: "Приглашения, персональная ссылка и бонусные дни в одном месте." },
  { name: "Профиль", caption: "Способы входа и сервисные настройки одного аккаунта." },
  { name: "Поддержка", caption: "Переписка с командой прямо в личном кабинете." },
  { name: "Юридическая информация", caption: "Соглашение, оферта и политика — в одном разделе с вкладками и удобной областью чтения." },
]

const stack = [
  { title: "Интерфейс", icon: PanelsTopLeft, items: ["Next.js · React · TypeScript", "Tailwind CSS", "shadcn/ui · Base UI"] },
  { title: "Сервер и данные", icon: Database, items: ["Node.js", "Prisma · SQLite", "Zod"] },
  { title: "Интеграции", icon: Plug, items: ["Platega · платежи", "Remnawave · VPN", "Telegram · бот и вход", "Resend · email"] },
]

export default function PulsarCloudPage() {
  return (
    <>
      <Section className="pt-6 pb-0 md:pt-10 md:pb-0" aria-labelledby="project-title">
        <Card className="gap-4 rounded-3xl bg-muted pt-0 ring-0 sm:rounded-[2rem]">
          <MediaPlaceholder label="Главный экран PULSAR VPN" ratio="aspect-[21/9]" />
          <CardHeader className="gap-4">
            <CardTitle><h1 id="project-title" className="home-section-title">PULSAR VPN</h1></CardTitle>
            <CardDescription className="max-w-2xl text-base leading-relaxed sm:text-lg">VPN-сервис с личным кабинетом и Telegram-ботом: подписка, подключение устройств и поддержка.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">VPN-Сервис</Badge>
              <Badge variant="outline">Web-Приложение</Badge>
              <Badge variant="outline">Telegram bot</Badge>
            </div>
            <ButtonLink href="https://pulsar-cloud.space" target="_blank" rel="noopener noreferrer" className="h-12 w-full shrink-0 px-6 md:w-auto">
              Открыть продукт <ArrowUpRight data-icon="inline-end" aria-hidden="true" />
            </ButtonLink>
          </CardContent>
        </Card>
      </Section>

      <Section aria-labelledby="project-about">
        <h2 id="project-about" className="home-section-title mb-10 md:mb-12">Что сделали</h2>
        <Separator />
        <div className="grid gap-8 py-8 md:py-10 lg:grid-cols-3 lg:gap-10">
          {[
            { title: "Интерфейс", items: ["Дизайн-система и адаптивный кабинет", "Вход через email и Telegram", "Подписка, устройства и поддержка"] },
            { title: "Логика продукта", items: ["Покупка и продление доступа", "Реферальная программа", "Административная система"] },
            { title: "Интеграции", items: ["Платежи и VPN-инфраструктура", "Email и Telegram", "Фоновые задачи и повторные попытки"] },
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

      <Section className="pt-0 md:pt-0" aria-label="Цветовая палитра PulsarVPN">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
          {[
            { color: "#E5E5E5", label: "Акцентный цвет" },
            { color: "#A1A1A1", label: "Вторичный текст" },
            { color: "#171717", label: "Карточки" },
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

      <Section className="pt-0 md:pt-0" aria-labelledby="project-telegram">
        <div className="grid items-center gap-8 rounded-3xl bg-muted p-6 sm:rounded-[2rem] sm:p-10 lg:grid-cols-2 lg:gap-12">
          <div className="flex flex-col items-start gap-5">
            <Badge variant="outline">Telegram bot</Badge>
            <h2 id="project-telegram" className="home-section-title">PulsarVPN в Telegram</h2>
            <p className="max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">Отдельный бот дополняет веб-кабинет: вход через Telegram и связь с сервисом в привычном мессенджере.</p>
          </div>
          <MediaPlaceholder label="Telegram-бот PulsarVPN" ratio="aspect-[3/2]" />
        </div>
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
              <h2 id="project-cta" className="max-w-xl text-3xl font-medium tracking-tight sm:text-4xl">Ваш продукт — следующий.</h2>
              <p className="max-w-lg text-muted-foreground">Обсудим интерфейс, логику и запуск вашего сервиса.</p>
              <ButtonLink href="/start?service=other&source=%2Fprojects%2Fpulsar-cloud" className="h-12 w-full sm:w-auto">Обсудить проект <ArrowUpRight data-icon="inline-end" aria-hidden="true" /></ButtonLink>
            </div>
          </HomeHeroSurface>
        </div>
      </Section>
    </>
  )
}

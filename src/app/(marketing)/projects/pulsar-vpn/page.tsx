import Image from "next/image"
import { ProjectPageTemplate } from "@/components/shared/project-page-template"
import { pulsarCloud } from "@/config/projects"
import { ArrowUpRight, Database, PanelsTopLeft, Plug } from "lucide-react"
import { Section } from "@/components/layout/section"
import { ButtonLink } from "@/components/shared/button-link"
import { HomeHeroSurface } from "@/components/shared/home-hero-surface"
import { pageMetadata } from "@/lib/seo"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

export const metadata = pageMetadata(
  "PULSAR VPN",
  "VPN-сервис с личным кабинетом, управлением подпиской, устройствами и поддержкой.",
  pulsarCloud.href
)

const screens = [
  {
    name: "Вход в аккаунт",
    caption: "Авторизация через Telegram или email с подтверждением кода — без отдельного пароля.",
    image: { src: "/images/projects/pulsar-vpn/auth.webp", alt: "Экраны входа и подтверждения кода" },
  },
  {
    name: "Главная и покупка подписки",
    caption: "Статус доступа и оформление подписки: срок, устройства и Plus на одном экране.",
    image: { src: "/images/projects/pulsar-vpn/home-and-buy.webp", alt: "Главный экран кабинета и панель покупки подписки" },
  },
  {
    name: "Подписка и устройства",
    caption: "Ссылка подключения, инструкция и управление доступными местами.",
    image: { src: "/images/projects/pulsar-vpn/sub.webp", alt: "Управление подпиской и подключёнными устройствами" },
  },
  {
    name: "Реферальная программа",
    caption: "Приглашения, персональная ссылка и бонусные дни в одном месте.",
    image: { src: "/images/projects/pulsar-vpn/ref.webp", alt: "Экран с реферальной ссылкой и бонусами" },
  },
  {
    name: "Профиль, поддержка и юридическая информация",
    caption: "Способы входа и настройки аккаунта, переписка с командой, соглашение, оферта и политика конфиденциальности.",
    image: { src: "/images/projects/pulsar-vpn/profile-support-legal.webp", alt: "Экраны профиля, чата с поддержкой и юридических документов" },
  },
]

const stack = [
  { title: "Интерфейс", icon: PanelsTopLeft, items: ["Next.js · React · TypeScript", "Tailwind CSS", "shadcn/ui · Base UI"] },
  { title: "Сервер и данные", icon: Database, items: ["Node.js", "Prisma · SQLite", "Zod"] },
  { title: "Интеграции", icon: Plug, items: ["Platega · платежи", "Remnawave · VPN", "Telegram · бот и вход", "Resend · email"] },
]

export default function PulsarVpnPage() {
  return (
    <ProjectPageTemplate screens={screens} stack={stack}
      about={[
            { title: "Интерфейс", items: ["Дизайн-система и адаптивный кабинет", "Вход через email и Telegram", "Подписка, устройства и поддержка"] },
            { title: "Логика продукта", items: ["Покупка и продление доступа", "Реферальная программа", "Административная система"] },
            { title: "Интеграции", items: ["Платежи и VPN-инфраструктура", "Email и Telegram", "Фоновые задачи и повторные попытки"] },
          ]}
      designDescription="Тёмная палитра, единая типографика и повторяемые компоненты связывают экраны кабинета. Карточки отделяют настройки от основного фона, а светлые акценты выделяют ключевые действия."
      palette={[
            { color: "#E5E5E5", label: "Акцентный цвет" },
            { color: "#A1A1A1", label: "Вторичный текст" },
            { color: "#171717", label: "Карточки" },
            { color: "#0A0A0A", label: "Основной фон" },
          ]}
      hero={<Section className="pt-6 pb-0 md:pt-10 md:pb-0" aria-labelledby="project-title">
        <Card className="gap-4 marketing-surface bg-muted pt-0 ring-0">
          <div className="marketing-surface relative aspect-[21/9] overflow-hidden">
            <Image
              src={pulsarCloud.cover.src}
              alt={pulsarCloud.cover.alt}
              quality={100}
              fill
              sizes="(max-width: 1399px) 100vw, 1336px"
              loading="eager"
              className="object-cover"
            />
          </div>
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
      </Section>}
      cta={<Section className="pt-0 md:pt-0" aria-labelledby="project-cta">
        <div className="overflow-hidden marketing-surface bg-card">
          <HomeHeroSurface>
            <div className="flex flex-col items-start gap-5 bg-linear-to-r from-card via-card/90 to-transparent px-6 py-10 sm:p-12">
              <h2 id="project-cta" className="max-w-xl text-3xl font-medium tracking-tight sm:text-4xl">Ваш продукт — следующий.</h2>
              <p className="max-w-lg text-muted-foreground">Обсудим интерфейс, логику и запуск вашего сервиса.</p>
              <ButtonLink href={`/start?service=other&source=${encodeURIComponent(pulsarCloud.href)}`} className="h-12 w-full sm:w-auto">Обсудить проект <ArrowUpRight data-icon="inline-end" aria-hidden="true" /></ButtonLink>
            </div>
          </HomeHeroSurface>
        </div>
      </Section>}
      afterScreens={<Section className="pt-0 md:pt-0" aria-labelledby="project-telegram">
        <div className="grid items-center gap-8 rounded-3xl bg-muted p-6 sm:rounded-[2rem] sm:p-10 lg:grid-cols-2 lg:gap-12">
          <div className="marketing-surface relative aspect-[4/3] overflow-hidden lg:order-2">
            <Image
              src="/images/projects/pulsar-vpn/telegram.webp"
              alt="Чат с ботом PulsarVPN в Telegram"
              quality={100}
              fill
              sizes="(max-width: 1023px) 100vw, (max-width: 1399px) 50vw, 604px"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col items-start gap-5 lg:order-1">
            <Badge variant="outline">Telegram bot</Badge>
            <h2 id="project-telegram" className="home-section-title">PulsarVPN в Telegram</h2>
            <p className="max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">Отдельный бот дополняет веб-кабинет: вход через Telegram и связь с сервисом в привычном мессенджере.</p>
          </div>
        </div>
      </Section>}
    />
  )
}

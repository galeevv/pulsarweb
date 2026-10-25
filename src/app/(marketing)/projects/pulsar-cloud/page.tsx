import Image from "next/image"
import { Section } from "@/components/layout/section"
import { PageHeader } from "@/components/shared/page-header"
import { ButtonLink } from "@/components/shared/button-link"
import { CTA } from "@/components/shared/cta"
import { Badge } from "@/components/ui/badge"
import { pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata(
  "Pulsar VPN",
  "VPN-сервис: личный кабинет, управление подпиской, оплата и интеграция с Telegram.",
  "/projects/pulsar-cloud"
)

export default function PulsarCloudPage() {
  return (
    <>
      <PageHeader
        eyebrow="Цифровой сервис / Запущен"
        title="Pulsar VPN"
        description="Единая система управления VPN-сервисом: от входа и оформления подписки до подключения устройств и поддержки."
      />
      <Section className="pt-0 md:pt-0">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <Badge variant="secondary">Запущен</Badge>
          <ButtonLink href="/projects" variant="outline">
            Все проекты
          </ButtonLink>
        </div>
        <Image
          src="/images/projects/pulsar-vpn-diagonal-16x9.webp"
          alt="Мобильный личный кабинет Pulsar VPN на смартфоне на металлической поверхности."
          width={1600}
          height={900}
          className="aspect-video w-full rounded-3xl object-cover"
        />
        <p className="mt-4 text-sm text-muted-foreground">
          AI-мокап на основе реального интерфейса с демонстрационными данными.
        </p>
        <div className="mt-8">
          <ButtonLink
            href="https://pulsar-cloud.space"
            target="_blank"
            rel="noopener noreferrer"
          >
            Открыть Pulsar VPN ↗
          </ButtonLink>
        </div>
      </Section>
      <Section className="bg-muted/40">
        <div className="grid gap-10 md:grid-cols-2">
          <div className="flex flex-col gap-4">
            <h2 className="text-3xl font-medium">Задача</h2>
            <p className="leading-relaxed text-muted-foreground">
              Объединить подписку, оплату, подключение устройств и поддержку в
              удобном мобильном кабинете. Связать сайт с Telegram и
              инфраструктурой VPN.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <h2 className="text-3xl font-medium">Реализация</h2>
            <ul className="flex list-disc flex-col gap-3 pl-5 text-muted-foreground">
              <li>Вход по email и через Telegram.</li>
              <li>Управление сроком подписки и количеством устройств.</li>
              <li>Оплата через Platega и выдача доступа через Remnawave.</li>
              <li>
                Инструкции подключения, обращения в поддержку и административный
                интерфейс.
              </li>
              <li>Реферальная программа и Telegram-уведомления.</li>
            </ul>
          </div>
        </div>
      </Section>
      <Section>
        <div className="grid gap-10 md:grid-cols-2">
          <div className="flex flex-col gap-4">
            <h2 className="text-3xl font-medium">Технологии</h2>
            <p className="leading-relaxed text-muted-foreground">
              Next.js, React, TypeScript, Tailwind CSS, shadcn/ui, Prisma и
              SQLite. Интеграции: Telegram Bot API, Resend, Platega и Remnawave.
              Развёртывание: Nginx, systemd и Next.js standalone.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <h2 className="text-3xl font-medium">Результат</h2>
            <p className="leading-relaxed text-muted-foreground">
              Сервис запущен и работает. Пользователь управляет доступом из
              личного кабинета, а административные сценарии и интеграции
              объединены в одной веб-системе.
            </p>
            <p className="text-sm text-muted-foreground">
              Описание подготовлено по материалам проекта. Данные о выручке и
              количестве пользователей не публикуются.
            </p>
          </div>
        </div>
      </Section>
      <CTA
        title="Обсудим ваш сервис"
        description="Поможем связать интерфейс, серверную логику и внешние интеграции в работающий продукт."
      />
    </>
  )
}

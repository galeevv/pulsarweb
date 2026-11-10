import {
  Gift,
  ArrowUpRight,
  PanelsTopLeft,
  MonitorSmartphone,
  Send,
  GlobeLock,
  Search,
  ChartNoAxesCombined,
} from "lucide-react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import Image from "next/image"
import { Section } from "@/components/layout/section"
import { ButtonLink } from "@/components/shared/button-link"
import { projectRequestHref } from "@/modules/leads/domain/request-config"

const included = [
  {
    title: "Структура и дизайн",
    description: "Под ваше предложение",
    icon: PanelsTopLeft,
  },
  {
    title: "На любом экране",
    description: "Телефон, планшет и компьютер",
    icon: MonitorSmartphone,
  },
  {
    title: "Формы заявок",
    description: "Уведомления в Telegram или email",
    icon: Send,
  },
  {
    title: "Домен и запуск",
    description: "Подключение домена, HTTPS и публикация сайта",
    icon: GlobeLock,
  },
  {
    title: "Базовое SEO",
    description: "Подготовка сайта к индексации",
    icon: Search,
  },
  {
    title: "Заявки в цифрах",
    description: "Яндекс Метрика, цели и UTM-метки",
    icon: ChartNoAxesCombined,
  },
]

export function LandingService() {
  const href = projectRequestHref("landing-pages")
  return (
    <>
      <Section className="pt-6 pb-0 md:pt-10 md:pb-0">
        <div className="grid overflow-hidden rounded-3xl bg-muted/40 ring-1 ring-border/60 sm:rounded-[2rem] lg:min-h-[520px] lg:grid-cols-2">
          <div className="flex flex-col items-start justify-center gap-6 p-6 sm:p-10 lg:p-12">
            <h1 className="home-section-title">
              Лендинги
              <br />
              под рекламу
            </h1>
            <p className="max-w-sm text-base leading-relaxed text-muted-foreground sm:text-lg">
              От вашего предложения — к первым заявкам. Создадим сайт и
              подготовим к запуску рекламы.
            </p>
            <ButtonLink href={href} className="mt-2 h-12 w-full sm:w-auto">
              Обсудить проект <ArrowUpRight data-icon="inline-end" />
            </ButtonLink>
          </div>
          <div className="relative aspect-[4/3] lg:aspect-auto">
            <Image
              src="/images/services/landing-form.webp"
              alt="Концепт лендинга FORM на ноутбуке"
              fill
              sizes="(max-width: 1023px) 100vw, 700px"
              className="object-cover"
              preload
            />
          </div>
        </div>
      </Section>
      <Section>
        <div className="flex flex-col gap-12 md:gap-16">
          <h2 className="home-section-title">Всё для первого запуска</h2>
          <ul className="grid gap-3 md:grid-cols-2 md:gap-4">
            {included.map(({ title, description, icon: Icon }) => (
              <li key={title} className="dark min-w-0">
                <Card className="relative h-full min-h-48 rounded-3xl sm:min-h-48 sm:rounded-[2rem]">
                  <CardHeader className="relative z-10 pr-24 sm:pr-36">
                    <CardTitle>
                      <h3 className="text-2xl leading-tight tracking-tight sm:text-3xl">
                        {title}
                      </h3>
                    </CardTitle>
                    <CardDescription className="max-w-52">
                      {description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-3 -bottom-5 p-0 sm:right-2"
                  >
                    <div className="absolute inset-0 translate-x-5 translate-y-4 rotate-12 rounded-[2rem] border border-border bg-muted" />
                    <div className="relative flex size-24 -rotate-12 items-center justify-center rounded-[2rem] border border-border bg-linear-to-br from-muted to-background shadow-2xl sm:size-32">
                      <Icon
                        className="size-12 text-foreground/80 sm:size-16"
                        strokeWidth={1}
                      />
                    </div>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        </div>
      </Section>
      <Section className="dark home-dark-panel text-foreground">
        <h2 className="home-section-title mb-12 md:mb-16">
          После запуска остаёмся рядом
        </h2>
        <Card className="grid min-h-48 grid-cols-[4rem_minmax(0,1fr)] items-center gap-5 rounded-3xl p-6 sm:grid-cols-[8rem_minmax(0,1fr)] sm:gap-8 sm:rounded-[2rem]">
          <div aria-hidden="true" className="relative">
            <div className="absolute inset-0 translate-x-2 translate-y-2 rounded-2xl border border-border bg-muted sm:rounded-[2rem]" />
            <div className="relative flex size-16 items-center justify-center rounded-2xl border border-border bg-linear-to-br from-muted to-background shadow-xl sm:size-32 sm:rounded-[2rem]">
              <Gift
                className="size-8 text-foreground/80 sm:size-16"
                strokeWidth={1}
              />
            </div>
          </div>
          <CardHeader className="gap-3 p-0">
            <CardTitle>
              <h3 className="text-2xl leading-tight tracking-tight sm:text-3xl">
                2 месяца сопровождения бесплатно
              </h3>
            </CardTitle>
            <CardDescription className="max-w-xl text-base leading-relaxed">
              Следим за сайтом и формами. Исправляем технические ошибки.
            </CardDescription>
          </CardHeader>
        </Card>
        <div className="mt-10 flex justify-center md:mt-12">
          <ButtonLink href={href} className="min-h-12 px-5">
            Обсудить проект <ArrowUpRight data-icon="inline-end" />
          </ButtonLink>
        </div>
      </Section>
      <Section>
        <Card className="dark gap-8 rounded-3xl [--card-spacing:--spacing(6)] sm:rounded-[2rem] sm:[--card-spacing:--spacing(12)]">
          <CardHeader className="gap-6">
            <CardTitle>
              <h2 className="home-section-title">Нужен лендинг под рекламу?</h2>
            </CardTitle>
            <CardDescription className="max-w-xl">
              <p className="text-base leading-relaxed">
                Расскажите о продукте или услуге — предложим структуру и
                согласуем, что нужно для запуска.
              </p>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ButtonLink href={href} className="h-12 w-full sm:w-auto">
              Обсудить проект <ArrowUpRight data-icon="inline-end" />
            </ButtonLink>
          </CardContent>
        </Card>
      </Section>
    </>
  )
}

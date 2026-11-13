import Image from "next/image"
import { ArrowUpRight } from "lucide-react"
import { serviceCatalog } from "@/config/service-catalog"
import { ButtonLink } from "@/components/shared/button-link"
import { HomeBadge } from "@/components/shared/home-badge"
import { Separator } from "@/components/ui/separator"

const services = [
  {
    id: "landing-pages",
    features: ["Адаптивный дизайн", "Яндекс Метрика", "Уведомления в Telegram"],
  },
  {
    id: "corporate-websites",
    features: ["Каталог услуг", "Кейсы и команда", "Формы заявок"],
  },
  {
    id: "ecommerce",
    features: [
      "Каталог и карточки товаров",
      "Корзина и оплата",
      "Управление заказами",
    ],
  },
  {
    id: "telegram",
    features: ["Telegram-боты", "Mini Apps", "Оплата и уведомления"],
  },
] as const

export function HomeServices() {
  return (
    <div>
      <h2 className="home-section-title mb-12 md:mb-16">Что мы делаем</h2>
      {services.map(({ id, features }) => {
        const service = serviceCatalog[id]
        return (
          <article
            className="home-service-panel"
            key={id}
            aria-labelledby={`home-service-${id}`}
          >
            <Separator />
            <div className="grid items-stretch gap-8 py-10 lg:grid-cols-2 lg:gap-12 lg:py-12">
              <div className="relative aspect-[3/2] self-start overflow-hidden rounded-3xl bg-card">
                <Image
                  src={`/images/services/${service.image}.webp`}
                  alt=""
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
              <div className="flex min-w-0 flex-col items-start justify-center gap-5">
                <h3
                  id={`home-service-${id}`}
                  className="text-3xl font-medium tracking-tight sm:text-4xl lg:text-5xl"
                >
                  {service.shortTitle}
                </h3>
                <p className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                  {service.description}
                </p>
                <ul
                  className="flex flex-wrap gap-2"
                  aria-label="Возможности услуги"
                >
                  {features.map((feature) => (
                    <li key={feature}>
                      <HomeBadge>{feature}</HomeBadge>
                    </li>
                  ))}
                </ul>
                {"priceNote" in service && (
                  <p className="text-sm text-muted-foreground">
                    {service.priceNote}
                  </p>
                )}
                <ButtonLink
                  href={`/services/${id}`}
                  className="h-12 w-full sm:w-auto"
                  aria-label={`${service.shortTitle} — ${service.priceLabel}`}
                >
                  {service.priceLabel} <ArrowUpRight data-icon="inline-end" />
                </ButtonLink>
              </div>
            </div>
          </article>
        )
      })}
    </div>
  )
}

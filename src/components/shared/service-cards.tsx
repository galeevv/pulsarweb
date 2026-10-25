import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { primaryServices } from "@/config/services"

const homeOrder = [
  "landing-pages",
  "corporate-websites",
  "telegram",
  "ecommerce",
]
const homeServices = primaryServices.toSorted(
  (a, b) => homeOrder.indexOf(a.slug) - homeOrder.indexOf(b.slug)
)

export function ServiceCards() {
  return (
    <>
      <h2 className="home-section-title mb-12 md:mb-16" data-home-heading>
        Что мы делаем
      </h2>
      <div className="service-grid">
        {homeServices.map((service) => (
          <Link
            key={service.slug}
            href={`/services/${service.slug}`}
            aria-labelledby={`service-card-${service.slug}`}
            className="service-tile group block min-w-0 rounded-3xl"
            data-home-reveal
          >
            <div
              className="service-visual relative overflow-hidden rounded-3xl bg-muted"
              data-home-media
            >
              <Image
                src={`/images/services/${service.image}.webp`}
                alt=""
                fill
                unoptimized
                sizes="(max-width: 767px) 100vw, (max-width: 1279px) 55vw, 720px"
                className="service-image object-cover"
              />
            </div>
            <div className="mt-5 flex items-start justify-between gap-4">
              <div className="flex min-w-0 flex-col gap-2">
                <h3
                  id={`service-card-${service.slug}`}
                  className="text-xl leading-tight font-medium tracking-tight sm:text-2xl"
                >
                  {service.shortTitle}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {service.cardDescription}
                </p>
              </div>
              <ArrowUpRight
                aria-hidden="true"
                className="service-arrow mt-1 size-5 shrink-0"
              />
            </div>
          </Link>
        ))}
      </div>
    </>
  )
}

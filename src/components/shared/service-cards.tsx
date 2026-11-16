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

export function ServiceCards({
  showHeading = true,
}: {
  showHeading?: boolean
}) {
  return (
    <>
      {showHeading && (
        <h2 className="home-section-title mb-12 md:mb-16">Что мы делаем</h2>
      )}
      <div className="service-grid">
        {homeServices.map((service) => (
          <Link
            key={service.slug}
            href={`/services/${service.slug}`}
            aria-labelledby={`service-card-${service.slug}`}
            className="service-tile group block min-w-0 rounded-3xl"
          >
            <div className="service-visual relative overflow-hidden rounded-3xl bg-muted">
                <Image
                  src={`/images/services2/${service.image.split("-")[0]}.webp`}
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
              <div className="flex shrink-0 flex-col items-end gap-2 pt-1">
                <ArrowUpRight
                  aria-hidden="true"
                  className="service-arrow size-5"
                />
                {"priceLabel" in service && (
                  <p className="text-sm leading-relaxed whitespace-nowrap text-muted-foreground">
                    {service.priceLabel}
                  </p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  )
}

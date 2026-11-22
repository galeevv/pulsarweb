import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { serviceCatalog } from "@/config/service-catalog"

const catalogOrder = [
  "landing-pages",
  "corporate-websites",
  "telegram",
  "ecommerce",
] as const

const serviceCards = [
  ...catalogOrder.map((slug) => {
    const service = serviceCatalog[slug]
    return {
      slug,
      title: service.shortTitle,
      description: service.cardDescription,
      href: "/services/" + slug,
      price: service.priceLabel,
      image: "/images/services/covers/" + service.image.split("-")[0] + ".webp",
      imageClass: "object-cover",
    }
  }),
  {
    slug: "support",
    title: serviceCatalog.support.shortTitle,
    description: "Мониторинг, резервные копии и обновления.",
    href: "/services/support",
    price: serviceCatalog.support.priceLabel,
    image: "/images/services/covers/support.webp",
    imageClass: "object-cover",
  },
  {
    slug: "other",
    title: serviceCatalog.other.shortTitle,
    description: "Разработка под нестандартную задачу.",
    href: "/start?service=other",
    price: undefined,
    image: "/images/services/covers/other.webp",
    imageClass: "object-cover",
  },
]

export function ServiceCards({
  showHeading = true,
}: {
  showHeading?: boolean
}) {
  const Heading = showHeading ? "h3" : "h2"

  return (
    <>
      {showHeading && (
        <h2 className="home-section-title mb-12 md:mb-16">Что мы делаем</h2>
      )}
      <div className="service-grid">
        {serviceCards.map(
          ({ slug, title, description, href, price, image, imageClass }) => (
            <Link
              key={slug}
              href={href}
              aria-labelledby={"service-card-" + slug}
              className="service-tile group block min-w-0 rounded-3xl"
            >
              <div className="service-visual relative overflow-hidden rounded-3xl bg-muted">
                <Image
                  src={image}
                  alt=""
                  fill
                  unoptimized
                  className={"service-image " + imageClass}
                />
              </div>
              <div className="mt-5 flex items-start justify-between gap-4">
                <div className="flex min-w-0 flex-col gap-2">
                  <Heading
                    id={"service-card-" + slug}
                    className="text-xl leading-tight font-medium tracking-tight sm:text-2xl"
                  >
                    {title}
                  </Heading>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {description}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2 pt-1">
                  <ArrowUpRight
                    aria-hidden="true"
                    className="service-arrow size-5"
                  />
                  {price && (
                    <p className="text-sm leading-relaxed whitespace-nowrap text-muted-foreground">
                      {price}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          )
        )}
      </div>
    </>
  )
}

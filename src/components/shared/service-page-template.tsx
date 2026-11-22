import Image from "next/image"
import { HomeHeroSurface } from "@/components/shared/home-hero-surface"
import { ServiceApproachVisual, type ApproachVisual } from "@/components/shared/service-approach-visual"
import { ArrowUpRight, Check } from "lucide-react"
import { Section } from "@/components/layout/section"
import { ButtonLink } from "@/components/shared/button-link"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { projectRequestHref } from "@/modules/leads/domain/request-config"
import type { primaryServiceIds } from "@/config/service-catalog"

export type ServicePageContent = {
  service: (typeof primaryServiceIds)[number] | "support"
  title: string
  description: string
  image?: { src: string; alt: string }
  badges: readonly string[]
  approach: readonly {
    title: string
    description: string
    visual?: ApproachVisual
    image?: string
  }[]
  support: { title: string; description: string }
  included: readonly { title: string; items: readonly string[] }[]
  includedTitle?: string
  duration: string
  price: string
  cta: { title: string; label: string }
  showPriceBesideCta?: boolean
}

export function ServicePageTemplate({
  content,
}: {
  content: ServicePageContent
}) {
  return (
    <>
      <Section
        className="pt-6 pb-0 md:pt-10 md:pb-0"
        aria-labelledby="service-title"
      >
        <Card className="gap-4 marketing-surface bg-muted pt-0 ring-0">
          <div className="relative aspect-[21/9] overflow-hidden marketing-surface">
            {content.image && (
              <Image
                src={content.image.src}
                alt={content.image.alt}
                fill
                unoptimized
                className="object-cover"
                preload
              />
            )}
            {!content.image && (
              <div aria-hidden="true" className="absolute inset-0 bg-background/50" />
            )}
          </div>
          <CardHeader className="gap-4">
              <CardTitle>
                <h1 id="service-title" className="home-section-title">{content.title}</h1>
              </CardTitle>
              <CardDescription className="max-w-2xl text-base leading-relaxed sm:text-lg">
                {content.description}
              </CardDescription>
              {content.showPriceBesideCta && (
                <p className="text-base font-medium">{content.price}</p>
              )}
          </CardHeader>
          <CardContent className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap gap-2">
            {content.badges.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="h-auto min-h-7 max-w-full px-3 py-1 text-left whitespace-normal"
              >
                {tag}
              </Badge>
            ))}
            </div>
            <ButtonLink
              href={projectRequestHref(content.service)}
              aria-label={`${content.cta.label} — ${content.price}`}
              className="h-12 w-full shrink-0 px-6 md:w-auto"
            >
              {content.showPriceBesideCta ? content.cta.label : content.price}
              <ArrowUpRight data-icon="inline-end" aria-hidden="true" />
            </ButtonLink>
          </CardContent>
        </Card>
      </Section>
      <Section className="pb-0 md:pb-0" aria-labelledby="service-approach">
        <h2 id="service-approach" className="home-section-title mb-10 md:mb-12">
          Наш подход
        </h2>
        <div className="grid gap-6 lg:grid-cols-3">
          {content.approach.map((item) => (
            <Card
              key={item.title}
              className="h-full gap-5 rounded-3xl pt-0 ring-0 sm:rounded-[2rem]"
            >
              <ServiceApproachVisual kind={item.visual} image={item.image} />
              <CardHeader>
                <CardTitle>
                  <h3 className="text-2xl tracking-tight">{item.title}</h3>
                </CardTitle>
                <CardDescription className="leading-relaxed">
                  {item.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </Section>
      <Section className="pb-0 md:pb-0" aria-labelledby="service-included">
        <h2 id="service-included" className="home-section-title mb-10 md:mb-12">
          {content.includedTitle ?? "Что входит в проект"}
        </h2>
        <Separator />
        <div className="grid gap-8 py-8 md:py-10 lg:grid-cols-3 lg:gap-10">
          {content.included.map((group) => (
            <div key={group.title} className="flex flex-col gap-5">
              <h3 className="text-xl font-medium tracking-tight">{group.title}</h3>
              <ul className="flex flex-col gap-3">
                {group.items.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                    <Check aria-hidden="true" className="mt-1 size-4 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <Separator />
      </Section>
      <Section aria-labelledby="service-cta">
        <div className="overflow-hidden marketing-surface bg-card">
          <HomeHeroSurface>
            <div className="bg-linear-to-r from-card via-card/90 to-transparent px-6 py-10 sm:px-12 sm:py-12 lg:px-16">
              <div className="flex max-w-xl flex-col items-start gap-5">
                <p className="text-sm text-muted-foreground">{content.price} · {content.duration}</p>
                <h2 id="service-cta" className="text-3xl font-medium tracking-tight text-balance sm:text-4xl lg:text-5xl">
                  {content.cta.title}
                </h2>
                <div className="flex flex-col gap-2">
                  <p className="text-base font-medium">{content.support.title}</p>
                  <p className="text-sm leading-relaxed text-muted-foreground">{content.support.description}</p>
                </div>
                <ButtonLink href={projectRequestHref(content.service)} className="mt-2 h-12 w-full px-6 sm:w-auto">
                  {content.cta.label}
                  <ArrowUpRight data-icon="inline-end" aria-hidden="true" />
                </ButtonLink>
              </div>
            </div>
          </HomeHeroSurface>
        </div>
      </Section>
    </>
  )
}

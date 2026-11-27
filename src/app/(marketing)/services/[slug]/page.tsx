import { LandingService } from "@/components/shared/landing-service"
import { CorporateService } from "@/components/shared/corporate-service"
import { ServicePageTemplate } from "@/components/shared/service-page-template"
import { additionalServiceContent } from "@/config/service-page-content"
import { notFound } from "next/navigation"
import { getService, primaryServices } from "@/config/services"
import { pageMetadata } from "@/lib/seo"
import { serviceSeo } from "@/config/service-seo"

type ServicePageProps = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return primaryServices.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: ServicePageProps) {
  const { slug } = await params
  const service = getService(slug)
  if (!service) notFound()
  const seo = serviceSeo(service.slug)
  const metadata = pageMetadata(
    seo.title,
    seo.description,
    `/services/${service.slug}`
  )
  return metadata
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params
  const service = getService(slug)
  if (!service) notFound()

  if (slug === "landing-pages") return <LandingService />
  if (slug === "corporate-websites") return <CorporateService />

  if (slug === "ecommerce" || slug === "telegram") {
    return <ServicePageTemplate content={additionalServiceContent[slug]} />
  }
  notFound()
}

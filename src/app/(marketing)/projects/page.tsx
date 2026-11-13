import { Section } from "@/components/layout/section"
import { LatestProjects } from "@/components/shared/latest-projects"
import { pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata(
  "Проекты",
  "Проекты PulsarWeb: сервис Pulsar VPN и собственный сайт студии PULSAR WEB.",
  "/projects"
)

export default function ProjectsPage() {
  return (
    <Section className="pt-12 md:pt-20">
      <h1 className="home-section-title mb-12 md:mb-16">Проекты</h1>
      <LatestProjects />
    </Section>
  )
}

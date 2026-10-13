import { ArrowUpRight } from "lucide-react"
import { ButtonLink } from "@/components/shared/button-link"
import { Badge } from "@/components/ui/badge"
import { ProjectCover } from "@/components/shared/project-cover"
import { pulsarCloud } from "@/config/projects"

export function ProjectPreview({ headingLevel = 2 }: { headingLevel?: 2 | 3 }) {
  const Heading = headingLevel === 2 ? "h2" : "h3"
  return (
    <article className="grid items-center gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
      <ProjectCover />
      <div className="flex flex-col items-start gap-6">
        <Badge variant="secondary">{pulsarCloud.status}</Badge>
        <Heading className="text-4xl font-medium tracking-tight sm:text-5xl">
          {pulsarCloud.name}
        </Heading>
        <p className="max-w-xl leading-relaxed text-muted-foreground">
          {pulsarCloud.description}
        </p>
        <ButtonLink href={pulsarCloud.href} variant="outline">
          Подробнее о проекте <ArrowUpRight data-icon="inline-end" />
        </ButtonLink>
      </div>
    </article>
  )
}

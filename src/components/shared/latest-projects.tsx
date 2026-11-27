import Image from "next/image"
import { publishedProjects } from "@/config/projects"
import { HomeProjectCard } from "@/components/shared/home-project-card"

export function LatestProjects({ headingLevel = "h3" }: { headingLevel?: "h2" | "h3" }) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {publishedProjects.map((project) => (
        <HomeProjectCard
          key={project.id}
          id={`project-${project.id}`}
          href={project.href}
          title={project.title}
          description={project.description}
          badges={project.badges}
          releaseYear={project.releaseYear}
          headingLevel={headingLevel}
          cover={
            <Image
              src={project.cover.src}
              alt={project.cover.alt}
              quality={100}
              fill
              sizes="(max-width: 767px) 100vw, (max-width: 1399px) 50vw, 656px"
              className="object-cover"
            />
          }
        />
      ))}
    </div>
  )
}

import type { ReactNode } from "react"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { HomeBadge } from "@/components/shared/home-badge"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"

type Props = {
  id: string
  href: string
  title: string
  description: string
  category: string
  cover: ReactNode
  status?: string
}

export function HomeProjectCard({
  id,
  href,
  title,
  description,
  category,
  cover,
  status = "В разработке",
}: Props) {
  return (
    <article aria-labelledby={id}>
      <Link
        href={href}
        aria-labelledby={id}
        className="project-card-link block h-full rounded-3xl sm:rounded-[2rem]"
      >
        <Card className="h-full gap-4 rounded-3xl bg-muted pt-0 ring-0 sm:gap-5 sm:rounded-[2rem]">
          <div className="relative aspect-video overflow-hidden rounded-3xl sm:rounded-[2rem]">
            <div className="service-image absolute inset-0">{cover}</div>
            <HomeBadge className="absolute top-4 left-4">{status}</HomeBadge>
          </div>
          <CardHeader>
            <CardTitle>
              <h3
                id={id}
                className="flex items-center justify-between gap-4 text-2xl tracking-tight"
              >
                <span>{title}</span>
                <ArrowUpRight
                  aria-hidden="true"
                  className="project-card-arrow size-5 shrink-0"
                />
              </h3>
            </CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent>
            <HomeBadge>{category}</HomeBadge>
          </CardContent>
        </Card>
      </Link>
    </article>
  )
}

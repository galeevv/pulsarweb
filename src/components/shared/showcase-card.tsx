import type { ReactNode } from "react"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card"

type ShowcaseCardProps = {
  id: string
  title: string
  description: string
  cover: ReactNode
  href?: string
  footer?: string
}

export function ShowcaseCard({
  id,
  title,
  description,
  cover,
  href,
  footer = "Подробнее",
}: ShowcaseCardProps) {
  const content = (
    <Card className="h-full min-w-0 gap-0 rounded-3xl pt-0">
      <div
        className="relative aspect-4/3 shrink-0 overflow-hidden bg-muted"
        aria-hidden="true"
      >
        {cover}
      </div>
      <CardHeader className="min-w-0 gap-2 pt-5 pb-4">
        <CardTitle>
          <h3 id={id}>{title}</h3>
        </CardTitle>
        <CardDescription className="min-w-0 truncate" title={description}>
          {description}
        </CardDescription>
      </CardHeader>
      <CardFooter className="mt-auto justify-between gap-3">
        <span className="text-sm text-muted-foreground transition-colors group-hover:text-foreground">
          {footer}
        </span>
        {href && (
          <ArrowUpRight
            aria-hidden="true"
            className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none"
          />
        )}
      </CardFooter>
    </Card>
  )

  return href ? (
    <Link
      href={href}
      aria-labelledby={id}
      className="group block min-w-0 rounded-3xl outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4"
    >
      {content}
    </Link>
  ) : (
    <article className="min-w-0" aria-labelledby={id}>
      {content}
    </article>
  )
}

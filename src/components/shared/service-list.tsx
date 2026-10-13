import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { services } from "@/config/services"
import { cn } from "@/lib/utils"

export function ServiceList({ compact = false }: { compact?: boolean }) {
  const Heading = compact ? "h3" : "h2"
  return (
    <div className={cn("grid", compact && "md:grid-cols-2 md:gap-x-16")}>
      {services.map((service, index) => (
        <article key={service.slug}>
          <Separator />
          <Link
            href={`/services/${service.slug}`}
            className={cn(
              "group grid gap-5 rounded-sm py-8 transition-opacity outline-none hover:opacity-75 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4",
              !compact && "md:grid-cols-[2.5rem_1fr_1fr_auto] md:gap-8 md:py-12"
            )}
          >
            <div className="flex items-center gap-4 text-muted-foreground">
              <service.icon className="size-6 shrink-0" aria-hidden="true" />
              <span
                className={cn("font-mono text-xs", !compact && "md:hidden")}
                aria-hidden="true"
              >
                0{index + 1}
              </span>
            </div>
            <Heading className="flex items-start justify-between gap-4 text-2xl font-medium tracking-tight">
              {service.shortTitle}
              {compact && (
                <ArrowUpRight
                  className="size-5 shrink-0 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                  aria-hidden="true"
                />
              )}
            </Heading>
            <p className="max-w-lg leading-relaxed text-muted-foreground">
              {service.description}
            </p>
            {!compact && (
              <ArrowUpRight
                className="size-5 shrink-0 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                aria-hidden="true"
              />
            )}
          </Link>
        </article>
      ))}
    </div>
  )
}

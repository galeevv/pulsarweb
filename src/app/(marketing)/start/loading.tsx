import { Section } from "@/components/layout/section"
import { Skeleton } from "@/components/ui/skeleton"
import { requestServiceIds, serviceCatalog } from "@/config/service-catalog"
import { cn } from "@/lib/utils"

export default function StartLoading() {
  return (
    <Section className="flex flex-1 items-center py-6 md:py-10">
      <div className="mx-auto w-full max-w-xl rounded-3xl border border-border/70 bg-muted/30 p-4 sm:p-6">
        <p role="status" className="sr-only">
          Загружаем форму…
        </p>
        <div aria-hidden="true" className="flex min-h-[520px] flex-col gap-6">
          <div className="grid grid-cols-2 gap-2">
            <Skeleton className="h-1 rounded-full" />
            <Skeleton className="h-1 rounded-full" />
          </div>
          <div className="flex flex-col items-center gap-4 py-2 text-center">
            <div className="flex size-16 items-center justify-center rounded-2xl border border-border/70 bg-background">
              <Skeleton className="size-6 rounded-md" />
            </div>
            <div className="flex flex-col items-center gap-2">
              {/* Invisible copy preserves the form's line wrapping on mobile. */}
              <div className="relative text-2xl leading-tight font-medium tracking-tight sm:text-3xl">
                <span className="invisible">Что хотите создать?</span>
                <Skeleton className="absolute inset-x-2 top-1/2 h-6 -translate-y-1/2 sm:h-7" />
              </div>
              <div className="relative max-w-sm text-sm leading-relaxed">
                <span className="invisible">
                  Выберите направление. Детали обсудим вместе.
                </span>
                <Skeleton className="absolute inset-x-6 top-1/2 h-3 -translate-y-1/2" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {requestServiceIds
              .filter((service) => service !== "support")
              .map((service) => (
                <div
                  key={service}
                  className={cn(
                    "flex min-h-20 min-w-0 flex-col items-center justify-center gap-2 rounded-2xl border border-input px-3 py-4",
                    service === "other" && "col-span-2 min-h-14 flex-row"
                  )}
                >
                  <Skeleton className="size-4 shrink-0 rounded-md" />
                  <div className="relative text-center text-sm font-medium">
                    <span className="invisible">
                      {serviceCatalog[service].title}
                    </span>
                    <Skeleton className="absolute inset-x-2 top-1/2 h-3 -translate-y-1/2" />
                  </div>
                </div>
              ))}
          </div>
          <div className="mt-auto pt-2">
            <Skeleton className="h-12 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    </Section>
  )
}

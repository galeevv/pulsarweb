import { Section } from "@/components/layout/section"
import { Skeleton } from "@/components/ui/skeleton"

export default function ContactsLoading() {
  return (
    <Section className="pt-4 md:pt-8">
      <div className="grid gap-14 lg:grid-cols-[0.8fr_1fr] lg:gap-24">
        <div className="flex min-w-0 flex-col gap-9 lg:col-start-2 lg:row-start-1">
          <p role="status" className="text-sm text-muted-foreground">
            Загружаем форму…
          </p>
          <div aria-hidden="true" className="flex flex-col gap-9">
            {[0, 1, 2].map((group) => (
              <div key={group} className="flex flex-col gap-5">
                <Skeleton className="h-5 w-36" />
                <Skeleton className="h-11 w-full" />
                <Skeleton className="h-11 w-full" />
              </div>
            ))}
            <Skeleton className="h-36 w-full" />
            <Skeleton className="h-12 w-48" />
          </div>
        </div>
        <div
          aria-hidden="true"
          className="flex flex-col gap-6 lg:col-start-1 lg:row-start-1"
        >
          <Skeleton className="h-8 w-64 max-w-full" />
          <Skeleton className="h-20 w-full max-w-sm" />
        </div>
      </div>
    </Section>
  )
}

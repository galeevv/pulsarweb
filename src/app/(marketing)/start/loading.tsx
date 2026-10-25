import { Section } from "@/components/layout/section"
import { Skeleton } from "@/components/ui/skeleton"

export default function StartLoading() {
  return (
    <Section className="py-10 md:py-16">
      <div className="mx-auto flex max-w-2xl flex-col gap-8">
        <p role="status" className="text-sm text-muted-foreground">
          Загружаем форму…
        </p>
        <div aria-hidden="true" className="flex flex-col gap-6">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-12 w-32 self-end" />
        </div>
      </div>
    </Section>
  )
}

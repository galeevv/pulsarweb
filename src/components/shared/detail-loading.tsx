import { Section } from "@/components/layout/section"
import { Skeleton } from "@/components/ui/skeleton"
export function DetailLoading() {
  return <Section className="pt-6 md:pt-10" aria-busy="true">
    <p role="status" className="sr-only">Загружаем страницу…</p>
    <div aria-hidden="true" className="flex flex-col gap-6">
      <Skeleton className="marketing-surface aspect-[21/9] w-full" />
      <Skeleton className="h-12 w-3/4" />
      <Skeleton className="h-6 w-2/3" />
      <Skeleton className="h-12 w-44" />
    </div>
  </Section>
}

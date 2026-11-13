import { Section } from "@/components/layout/section"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"

export default function StartLoading() {
  return (
    <Section className="flex flex-1 items-center py-6 md:py-10">
      <div
        className="mx-auto w-full max-w-xl rounded-3xl border border-border/70 bg-muted/30 p-4 sm:p-6"
        aria-busy="true"
      >
        <p role="status" className="sr-only">
          Загружаем способы связи…
        </p>
        <div aria-hidden="true" className="flex flex-col gap-6">
          <div className="-mx-4 -mt-4 flex h-44 items-center justify-center border-b border-border sm:-mx-6 sm:-mt-6 sm:h-50">
            <Skeleton className="size-28 rounded-3xl" />
          </div>
          <div className="flex flex-col items-center gap-2">
            <Skeleton className="h-8 w-4/5 sm:h-9" />
            <Skeleton className="h-5 w-3/5" />
          </div>
          <div className="flex flex-col gap-4">
            <Skeleton className="h-12 w-full rounded-2xl" />
            <div className="flex h-4 items-center gap-4">
              <div className="flex-1">
                <Separator />
              </div>
              <Skeleton className="h-3 w-5" />
              <div className="flex-1">
                <Separator />
              </div>
            </div>
            <Skeleton className="h-12 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    </Section>
  )
}

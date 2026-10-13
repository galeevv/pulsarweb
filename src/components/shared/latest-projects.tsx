import Link from "next/link"
import { ArrowUpRight, Orbit } from "lucide-react"

export function LatestProjects() {
  return (
    <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
      <article className="flex flex-col gap-5">
        <div
          aria-hidden="true"
          className="flex aspect-[2/1] flex-col justify-between rounded-2xl bg-primary p-5 text-primary-foreground"
        >
          <Orbit className="size-6" strokeWidth={1.5} />
          <p className="text-3xl font-medium tracking-[-0.05em]">PULSAR VPN</p>
          <span className="font-mono text-xs tracking-widest">VPN SERVICE</span>
        </div>
        <div className="flex flex-col gap-2">
          <p className="eyebrow">В разработке</p>
          <h3 className="text-2xl font-medium tracking-tight">PULSAR VPN</h3>
          <p className="leading-relaxed text-muted-foreground">
            VPN-сервис. Подробности проекта добавим после запуска.
          </p>
        </div>
      </article>
      <article className="flex flex-col gap-5">
        <div
          aria-hidden="true"
          className="flex aspect-[2/1] flex-col justify-between rounded-2xl border bg-background p-5"
        >
          <span className="font-mono text-xs tracking-widest text-muted-foreground">
            PORTFOLIO
          </span>
          <p className="text-3xl font-medium tracking-[-0.06em]">
            GALEEV<span className="text-muted-foreground">.</span>
          </p>
          <span className="font-mono text-xs tracking-widest text-muted-foreground">
            PERSONAL WEBSITE
          </span>
        </div>
        <div className="flex flex-col gap-2">
          <p className="eyebrow">В разработке</p>
          <h3 className="text-2xl font-medium tracking-tight">GALEEV</h3>
          <p className="leading-relaxed text-muted-foreground">
            Сайт-портфолио. Скоро покажем готовый сайт и расскажем о работе.
          </p>
        </div>
      </article>
      <Link
        href="/projects"
        className="group flex flex-col gap-5 rounded-2xl transition-opacity hover:opacity-75 md:col-span-2 lg:col-span-1"
      >
        <div
          aria-hidden="true"
          className="hidden aspect-[2/1] items-center justify-center rounded-2xl border bg-background/50 lg:flex"
        >
          <ArrowUpRight
            className="size-16 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 motion-reduce:transform-none"
            strokeWidth={1}
          />
        </div>
        <div className="flex flex-col gap-2 rounded-2xl border p-6 lg:rounded-none lg:border-0 lg:p-0">
          <p className="eyebrow">Портфолио</p>
          <h3 className="flex items-center justify-between gap-4 text-2xl font-medium tracking-tight">
            Все проекты{" "}
            <ArrowUpRight
              className="size-5 shrink-0 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 motion-reduce:transform-none lg:hidden"
              aria-hidden="true"
            />
          </h3>
          <p className="leading-relaxed text-muted-foreground">
            Больше работ и подробностей о каждом проекте.
          </p>
        </div>
      </Link>
    </div>
  )
}

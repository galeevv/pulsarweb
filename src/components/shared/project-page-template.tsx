import Image from "next/image"
import type { ReactNode } from "react"
import { Check, ImageIcon, type LucideIcon } from "lucide-react"
import { Section } from "@/components/layout/section"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
function MediaPlaceholder({ label, ratio }: { label: string; ratio: string }) {
  return (
    <div className={cn("relative flex min-w-0 flex-col items-center justify-center gap-3 overflow-hidden marketing-surface bg-background/50 p-6 text-center", ratio)}>
      <ImageIcon className="size-7 text-muted-foreground" aria-hidden="true" />
      <p className="text-sm font-medium">{label}</p>
      <p className="text-xs text-muted-foreground">Место для изображения</p>
    </div>
  )
}

type Props = {
  hero: ReactNode; cta: ReactNode; afterScreens?: ReactNode
  about: { title: string; items: string[] }[]
  palette: { color: string; label: string }[]
  designDescription?: string
  screens: { name: string; caption: string; image?: { src: string; alt: string } }[]
  stack: { title: string; icon: LucideIcon; items: string[] }[]
}
export function ProjectPageTemplate({ hero, cta, afterScreens, about, palette, designDescription, screens, stack }: Props) {
  return <>{hero}
      <Section aria-labelledby="project-about">
        <h2 id="project-about" className="home-section-title mb-10 md:mb-12">Что сделали</h2>
        <Separator />
        <div className="grid gap-8 py-8 md:py-10 lg:grid-cols-3 lg:gap-10">
          {about.map((group) => (
            <div key={group.title} className="flex flex-col gap-5">
              <h3 className="text-xl font-medium tracking-tight">{group.title}</h3>
              <ul className="flex flex-col gap-3">
                {group.items.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                    <Check aria-hidden="true" className="mt-1 size-4 shrink-0" /><span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <Separator />
      </Section>

      <Section
        className="pt-0 md:pt-0"
        aria-labelledby={designDescription ? "project-design" : undefined}
        aria-label={designDescription ? undefined : "Цветовая палитра проекта"}
      >
        {designDescription && (
          <div className="mb-8 flex flex-col gap-4 md:mb-10">
            <h2 id="project-design" className="home-section-title">
              Дизайн-система
            </h2>
            <p className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {designDescription}
            </p>
          </div>
        )}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
          {palette.map(({ color, label }) => (
            <div key={color} className="flex flex-col gap-3">
              <div className="h-24 rounded-2xl border border-border sm:h-32" style={{ backgroundColor: color }} aria-hidden="true" />
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium">{label}</p>
                <p className="font-mono text-xs text-muted-foreground">{color}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section className="pt-0 md:pt-0" aria-labelledby="project-screens">
        <h2 id="project-screens" className="home-section-title mb-12 md:mb-16">Интерфейс</h2>
        {screens.map((screen, index) => (
          <article key={screen.name} className="home-service-panel" aria-labelledby={`project-screen-${index}`}>
            <Separator />
            <div className="grid items-stretch gap-8 py-10 lg:grid-cols-2 lg:gap-12 lg:py-12">
              {screen.image ? (
                <div className="marketing-surface relative aspect-[4/3] self-start overflow-hidden bg-muted">
                  <Image
                    src={screen.image.src}
                    alt={screen.image.alt}
                    quality={100}
                    fill
                    sizes="(max-width: 1023px) 100vw, (max-width: 1399px) 50vw, 644px"
                    className="object-cover"
                  />
                </div>
              ) : (
                <MediaPlaceholder label={screen.name} ratio="aspect-[3/2] self-start" />
              )}
              <div className="flex min-w-0 flex-col items-start justify-center gap-5">
                <h3 id={`project-screen-${index}`} className="text-3xl font-medium tracking-tight sm:text-4xl lg:text-5xl">{screen.name}</h3>
                <p className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">{screen.caption}</p>
              </div>
            </div>
          </article>
        ))}
      </Section>

      {afterScreens}

      <Section className="pt-0 md:pt-0" aria-labelledby="project-stack">
        <h2 id="project-stack" className="text-3xl font-medium tracking-tight sm:text-4xl">Технологии и сервисы</h2>
        <div className="mt-8 grid gap-8 lg:grid-cols-3 lg:gap-10">
          {stack.map((group) => (
            <div key={group.title} className="flex min-w-0 flex-col gap-5">
              <Separator />
              <h3 className="flex items-center gap-3 text-xl font-medium tracking-tight">
                <group.icon className="size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
                {group.title}
              </h3>
              <ul className="flex flex-col gap-3 text-base leading-relaxed text-muted-foreground">
                {group.items.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </Section>

{cta}</>
}

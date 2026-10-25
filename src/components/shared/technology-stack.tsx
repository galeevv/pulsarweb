import { Code2, Component, Plug, Sparkles } from "lucide-react"
import { Section } from "@/components/layout/section"
import { SectionHeader } from "@/components/shared/section-header"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

const groups = [
  {
    title: "Разработка",
    icon: Code2,
    items: ["Next.js", "React", "TypeScript", "Electron"],
  },
  {
    title: "Интерфейсы",
    icon: Component,
    items: ["Tailwind CSS", "shadcn/ui", "Lucide"],
  },
  {
    title: "Интеграции",
    icon: Plug,
    items: [
      "Telegram Bot API",
      "Resend",
      "Платёжные системы",
      "Яндекс Метрика",
    ],
  },
  {
    title: "AI-инструменты",
    icon: Sparkles,
    items: ["ChatGPT", "Claude Code"],
  },
] as const

export function TechnologyStack() {
  return (
    <Section id="technologies" aria-label="Технологии и инструменты">
      <SectionHeader
        eyebrow="Наш стек"
        title="Технологии под задачу."
        description="Для разработки, интеграций и работы над продуктом."
      />
      <Separator />
      <ul className="grid gap-10 py-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        {groups.map((group) => (
          <li key={group.title} className="flex min-w-0 flex-col gap-5">
            <div className="flex items-center gap-3">
              <group.icon
                aria-hidden="true"
                className="size-5 shrink-0 text-muted-foreground"
                strokeWidth={1.5}
              />
              <h3 className="text-sm font-medium">{group.title}</h3>
            </div>
            <ul className="flex flex-wrap gap-2">
              {group.items.map((item) => (
                <li key={item}>
                  <Badge variant="secondary" className="h-auto px-3 py-1.5">
                    {item}
                  </Badge>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      <Separator />
    </Section>
  )
}

import { Compass, Blocks, Code2, Rocket } from "lucide-react"
import { Separator } from "@/components/ui/separator"

const steps = [
  {
    icon: Compass,
    title: "Обсуждаем",
    text: "Уточняем задачу, объём и сроки.",
  },
  {
    icon: Blocks,
    title: "Проектируем",
    text: "Продумываем структуру и сценарии.",
  },
  {
    icon: Code2,
    title: "Разрабатываем",
    text: "Показываем рабочие версии и тестируем.",
  },
  {
    icon: Rocket,
    title: "Запускаем",
    text: "Настраиваем сервер и публикуем проект.",
  },
]

export function DeliveryProcess() {
  return (
    <ol className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
      {steps.map((step, index) => (
        <li key={step.title} className="flex flex-col gap-5">
          <div className="flex items-center justify-between text-muted-foreground">
            <step.icon className="size-6" aria-hidden="true" />
            <span className="font-mono text-xs" aria-hidden="true">
              0{index + 1}
            </span>
          </div>
          <Separator />
          <h3 className="text-xl font-medium tracking-tight">{step.title}</h3>
          <p className="leading-relaxed text-muted-foreground">{step.text}</p>
        </li>
      ))}
    </ol>
  )
}

import { Separator } from "@/components/ui/separator"

const steps = [
  {
    title: "Обсуждаем",
    text: "Уточняем задачу, объём и сроки.",
  },
  {
    title: "Проектируем",
    text: "Продумываем структуру и сценарии.",
  },
  {
    title: "Разрабатываем",
    text: "Показываем рабочие версии и тестируем.",
  },
  {
    title: "Запускаем",
    text: "Настраиваем сервер и публикуем проект.",
  },
]

export function DeliveryProcess() {
  return (
    <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {steps.map((step, index) => (
        <li
          key={step.title}
          className="flex flex-col gap-6 rounded-3xl bg-card p-6 text-card-foreground"
        >
          <div className="flex items-center justify-between text-muted-foreground">
            <span
              className="text-4xl font-medium tracking-tight"
              aria-hidden="true"
            >
              0{index + 1}
            </span>
          </div>
          <Separator />
          <h3 className="text-2xl font-medium tracking-tight">{step.title}</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {step.text}
          </p>
        </li>
      ))}
    </ol>
  )
}

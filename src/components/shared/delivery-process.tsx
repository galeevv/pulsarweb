import { HomeBadge } from "@/components/shared/home-badge"

const steps = [
  {
    title: "Обсуждаем задачу",
    text: "Разбираемся в продукте и аудитории. Определяем объём работ, сроки и стоимость.",
  },
  {
    title: "Проектируем и рисуем",
    text: "Продумываем структуру и путь к заявке. Согласуем дизайн до начала разработки.",
  },
  {
    title: "Разрабатываем и проверяем",
    text: "Собираем сайт, подключаем интеграции. Проверяем формы, скорость и работу на разных устройствах.",
  },
  {
    title: "Запускаем и сопровождаем",
    text: "Подключаем домен и публикуем сайт. Следим за работой проекта и устраняем технические ошибки.",
  },
]

export function DeliveryProcess() {
  return (
    <div className="process-timeline">
      <div className="process-track" aria-hidden="true">
        <div className="process-progress" />
      </div>
      <ol>
        {steps.map((step, index) => (
          <li key={step.title} className="process-step">
            <div className="process-step-inner">
              <span className="process-dot" aria-hidden="true" />
              <div className="process-copy flex flex-col items-start gap-4">
                <HomeBadge>Этап 0{index + 1}</HomeBadge>
                <h3 className="text-3xl font-medium tracking-tight lg:text-5xl">
                  {step.title}
                </h3>
                <p className="max-w-md text-base leading-relaxed text-muted-foreground md:text-lg">
                  {step.text}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}

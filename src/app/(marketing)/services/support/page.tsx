import {
  ServicePageTemplate,
  type ServicePageContent,
} from "@/components/shared/service-page-template"
import { serviceCatalog } from "@/config/service-catalog"
import { pageMetadata } from "@/lib/seo"

const support = serviceCatalog.support

export const metadata = pageMetadata(
  support.shortTitle,
  support.description,
  "/services/support"
)

const content = {
  service: "support",
  title: support.shortTitle,
  description:
    "Берём на себя техническую эксплуатацию после запуска. Следим за работой проекта, обновляем его и разбираемся со сбоями.",
  image: {
    src: "/images/services/covers/support.webp",
    alt: "Сервер для технического сопровождения проекта",
  },
  badges: ["Мониторинг", "Резервные копии", "Обновления"],
  approach: [
    {
      title: "Подключаем проект",
      image: "/images/services/approach/support-connect.webp",
      description:
        "В первую очередь сопровождаем проекты PulsarWeb. Для стороннего проекта сначала проверим состояние и нужные доступы, затем предложим условия.",
    },
    {
      title: "Следим за работой",
      image: "/images/services/approach/support-monitor.webp",
      description:
        "Проверяем доступность и согласованные сценарии, например доставку заявок. Заранее согласуем канал связи и время реакции на сбои.",
    },
    {
      title: "Помогаем с изменениями",
      image: "/images/services/approach/support-updates.webp",
      description:
        "Помогаем с небольшими задачами в согласованном объёме. Новые функции, редизайн и сложные интеграции оцениваем отдельно.",
    },
  ],
  includedTitle: "Что входит в сопровождение",
  included: [
    {
      title: "Инфраструктура",
      items: [
        "Администрирование VPS, домена и SSL-сертификата",
        "Публикация согласованных обновлений",
        "Конфигурация и расходы на инфраструктуру согласуются заранее",
      ],
    },
    {
      title: "Работоспособность",
      items: [
        "Мониторинг доступности и ключевых сценариев",
        "Резервные копии и восстановление",
        "Диагностика и устранение технических сбоев",
      ],
    },
    {
      title: "Плановые работы",
      items: [
        "Обновление проекта и поддержка согласованных интеграций",
        "Небольшие доработки в согласованном объёме",
        "Отдельная оценка при существенном росте нагрузки",
      ],
    },
  ],
  support: {
    title: "Первые два месяца после запуска",
    description:
      "В стоимость разработки включены техническая помощь и исправление ошибок в согласованных функциях. Регулярное обслуживание инфраструктуры и небольшие доработки можно подключить ежемесячно.",
  },
  duration: "для одного проекта",
  price: support.priceLabel,
  showPriceBesideCta: true,
  cta: {
    title: "Обсудим сопровождение вашего проекта",
    label: support.cta,
  },
} satisfies ServicePageContent

export default function SupportPage() {
  return <ServicePageTemplate content={content} />
}

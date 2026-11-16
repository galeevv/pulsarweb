import {
  ServicePageTemplate,
  type ServicePageContent,
} from "@/components/shared/service-page-template"

const landingContent = {
  service: "landing-pages",
  title: "Лендинги под рекламу",
  description:
    "От вашего предложения — к первым заявкам. Создадим лендинг и подготовим его к запуску рекламы.",
  image: {
    src: "/images/services2/landing.webp",
    alt: "Пример лендинга на ноутбуке",
  },
  badges: [
    "Загрузка < 1 сек",
    "Mobile-first архитектура",
    "Готов к Яндекс.Метрике и целям",
  ],
  approach: [
    {
      title: "Сначала смыслы",
      visual: "structure",
      description:
        "Разбираемся в продукте и аудитории. Находим главное в предложении и собираем понятную структуру страницы.",
    },
    {
      title: "Удобно с телефона",
      visual: "mobile",
      description:
        "Читаемый текст, удобные кнопки и простая форма заявки. Продумываем путь клиента на небольшом экране.",
    },
    {
      title: "Скорость без лишнего",
      visual: "speed",
      description:
        "Оптимизируем изображения и код. Оставляем только то, что помогает странице быстро работать и раскрывать предложение.",
    },
  ],
  included: [
    {
      title: "Дизайн и структура",
      items: [
        "Индивидуальный дизайн",
        "Структура под предложение и аудиторию",
        "Адаптивная версия",
      ],
    },
    {
      title: "Техническая часть",
      items: [
        "Оптимизация скорости",
        "Базовая подготовка к поиску",
        "Формы заявок",
      ],
    },
    {
      title: "Запуск и аналитика",
      items: [
        "Запуск на вашем домене",
        "Заявки в Telegram, email или CRM",
        "Аналитика заявок и источников трафика",
      ],
    },
  ],
  duration: "от 7 рабочих дней",
  price: "от 25 000 ₽",
  support: {
    title: "2 месяца поддержки включены",
    description:
      "Техническая помощь и исправление ошибок после запуска. Правки контента — по договорённости.",
  },
  cta: {
    title: "Запустим лендинг. Останемся на связи.",
    label: "Обсудить лендинг",
  },
} satisfies ServicePageContent

export function LandingService() {
  return <ServicePageTemplate content={landingContent} />
}

// Shared product vocabulary. Keep this module free of UI and server dependencies.
export const primaryServiceIds = [
  "landing-pages",
  "corporate-websites",
  "ecommerce",
  "telegram",
] as const
export const requestServiceIds = [
  ...primaryServiceIds,
  "support",
  "other",
] as const
export type RequestService = (typeof requestServiceIds)[number]

type ServiceSummary = {
  title: string
  shortTitle: string
  description: string
  cardDescription: string
  placeholder: string
  cta: string
  kind: "PROJECT" | "SUPPORT"
  image: string
}

export const serviceCatalog = {
  "landing-pages": {
    title: "Лендинг под рекламу",
    shortTitle: "Лендинги под рекламу",
    description:
      "Одностраничные сайты для рекламы, заявок и запуска нового предложения.",
    cardDescription: "Для рекламы, заявок и новых предложений.",
    placeholder:
      "Например: нужен лендинг для рекламы новой услуги, с формой заявки и аналитикой. Уведомления хотим получать в Telegram.",
    cta: "Обсудить лендинг",
    kind: "PROJECT",
    image: "landing-form",
  },
  "corporate-websites": {
    title: "Корпоративный сайт",
    shortTitle: "Корпоративные сайты",
    description:
      "Сайты компаний с продуманной структурой, услугами, кейсами и формами заявок.",
    cardDescription: "Структура, услуги, кейсы и заявки.",
    placeholder:
      "Например: нужен сайт компании с услугами, кейсами, контактами и формами заявок. Ориентировочно 8 страниц.",
    cta: "Обсудить сайт",
    kind: "PROJECT",
    image: "corporate-atelier",
  },
  ecommerce: {
    title: "Интернет-магазин",
    shortTitle: "Интернет-магазины",
    description:
      "Каталог, карточки товаров, корзина, оплата и управление заказами.",
    cardDescription: "Каталог, корзина, оплата и заказы.",
    placeholder:
      "Например: нужен интернет-магазин с каталогом, фильтрами, корзиной, оплатой и уведомлениями о заказах. Расскажите о товарах и доставке.",
    cta: "Обсудить магазин",
    kind: "PROJECT",
    image: "ecommerce-sound",
  },
  telegram: {
    title: "Бизнес в Telegram",
    shortTitle: "Бизнес в Telegram",
    description:
      "Боты и Mini Apps для заявок, продаж, оплаты и автоматизации процессов.",
    cardDescription: "Боты и Mini Apps для заявок и продаж.",
    placeholder:
      "Например: нужен Telegram-бот или Mini App для каталога, записи, оплаты и уведомлений. Опишите, какие процессы нужно автоматизировать.",
    cta: "Обсудить Telegram-проект",
    kind: "PROJECT",
    image: "telegram-bloom",
  },
  support: {
    title: "Сопровождение",
    shortTitle: "Техническое сопровождение",
    description:
      "Мониторинг, резервные копии, обновления и дальнейшее развитие проектов PulsarWeb после запуска.",
    cardDescription: "Поддержка и развитие после запуска.",
    placeholder:
      "Расскажите о проекте и задачах по сопровождению или дальнейшему развитию. В первую очередь сопровождаем проекты PulsarWeb.",
    cta: "Обсудить сопровождение",
    kind: "SUPPORT",
    image: "support",
  },
  other: {
    title: "Другой проект",
    shortTitle: "Другой проект",
    description: "Расскажите о задаче — определим подход.",
    cardDescription: "Индивидуальная разработка под задачу.",
    placeholder:
      "Например: нужна CRM, SaaS, внутренняя система, desktop-приложение или нестандартная автоматизация. Опишите задачу и желаемый результат.",
    cta: "Обсудить проект",
    kind: "PROJECT",
    image: "other",
  },
} as const satisfies Record<RequestService, ServiceSummary>

// Old deep links select a current scenario; stored/API values remain unchanged.
export const legacyServiceMap = {
  websites: "landing-pages",
  "web-systems": "other",
  desktop: "other",
} as const satisfies Record<string, RequestService>
export type LegacyService = keyof typeof legacyServiceMap
export const legacyServiceIds = ["websites", "web-systems", "desktop"] as const
export function resolveRequestService(
  value: unknown
): RequestService | undefined {
  if (typeof value !== "string") return undefined
  if (Object.hasOwn(serviceCatalog, value)) return value as RequestService
  return Object.hasOwn(legacyServiceMap, value)
    ? legacyServiceMap[value as LegacyService]
    : undefined
}
export function serviceLabel(value: string): string {
  const legacyLabels: Record<LegacyService, string> = {
    websites: "Разработка сайтов",
    "web-systems": "Web-системы",
    desktop: "Desktop-приложения",
  }
  if (Object.hasOwn(legacyLabels, value))
    return legacyLabels[value as LegacyService]
  const service = resolveRequestService(value)
  return service ? serviceCatalog[service].title : value
}

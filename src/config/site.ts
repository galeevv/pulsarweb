export const site = {
  name: "PulsarWeb",
  seoTitle: "Разработка сайтов и Telegram-приложений",
  description:
    "Разрабатываем лендинги, корпоративные сайты, интернет-магазины и Telegram-ботов для бизнеса. Дизайн, разработка и запуск — с поддержкой после публикации.",
  tagline: "Разработка. Запуск. Сопровождение.",
  locale: "ru_RU",
  language: "ru",
  company: {
    legalName: null,
    taxId: null,
    address: null,
    email: null,
  } satisfies Record<string, string | null>,
  telegramChannelUrl: "https://t.me/pulsarweb_dev",
  optionalCookies: false,
} as const

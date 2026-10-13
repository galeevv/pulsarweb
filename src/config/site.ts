export const site = {
  name: "PulsarWeb",
  description:
    "Небольшая студия разработки цифровых решений для бизнеса. Сайты, web-системы и автоматизация — от идеи до запуска и сопровождения.",
  tagline: "Разработка. Запуск. Сопровождение.",
  locale: "ru_RU",
  language: "ru",
  company: {
    legalName: null,
    taxId: null,
    address: null,
    email: null,
  } satisfies Record<string, string | null>,
  optionalCookies: false,
} as const

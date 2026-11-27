import { primaryServiceIds, serviceCatalog } from "./service-catalog"

type ServiceSlug = (typeof primaryServiceIds)[number]

const titles: Record<ServiceSlug, string> = {
  "landing-pages": "Разработка лендингов под рекламу",
  "corporate-websites": "Разработка корпоративных сайтов",
  ecommerce: "Разработка интернет-магазинов",
  telegram: "Разработка Telegram-ботов и Mini Apps",
}

const descriptions: Record<ServiceSlug, string> = {
  "landing-pages": "Создаём лендинги для бизнеса: структура, индивидуальный дизайн, адаптивная разработка, формы заявок и аналитика.",
  "corporate-websites": "Создаём сайты компаний с услугами, кейсами и формами заявок. Продумываем структуру, дизайн и адаптацию для мобильных устройств.",
  ecommerce: "Создаём интернет-магазины: каталог, корзина, онлайн-оплата и управление заказами. Подключаем нужные бизнесу интеграции.",
  telegram: "Разрабатываем Telegram-ботов и Mini Apps для заявок, продаж и автоматизации. Подключаем оплату, уведомления и внешние сервисы.",
}

export function serviceSeo(slug: ServiceSlug) {
  return {
    title: titles[slug],
    description: `${descriptions[slug]} Стоимость ${serviceCatalog[slug].priceLabel}.`,
  }
}

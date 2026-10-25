import {
  Globe2,
  PanelsTopLeft,
  ShoppingCart,
  Send,
  Wrench,
  Lightbulb,
  type LucideIcon,
} from "lucide-react"
import {
  serviceCatalog,
  primaryServiceIds,
  requestServiceIds,
  type RequestService,
} from "./service-catalog"
import { legacyServices } from "./legacy-services"

export const serviceIds = requestServiceIds
export type ServiceId = RequestService
type PageContent = {
  title: string
  eyebrow: string
  intro: string
  outcomes: readonly { title: string; description: string }[]
  deliverables: readonly string[]
  process: readonly { title: string; description: string }[]
  faq: readonly { question: string; answer: string }[]
}
const newPages = {
  "landing-pages": {
    title: "Лендинги под рекламу.",
    eyebrow: "01 / Лендинги",
    intro:
      "Одна страница — одно предложение. Выстраиваем путь от рекламного объявления до заявки и готовим лендинг к запуску.",
    outcomes: [
      {
        title: "Ясное предложение",
        description:
          "Раскрываем продукт или услугу, отвечаем на вопросы клиента и ведём к целевому действию.",
      },
      {
        title: "Заявки без потерь",
        description:
          "Настраиваем формы и нужный способ получения обращений: Telegram, email или интеграцию с вашей системой.",
      },
      {
        title: "Измеримый путь клиента",
        description:
          "По задаче подключаем Яндекс Метрику, цели и UTM, чтобы видеть источники обращений.",
      },
    ],
    deliverables: [
      "Структура и дизайн одностраничного сайта",
      "Адаптивная разработка и формы заявок",
      "Telegram-уведомления и управление — по задаче",
      "Аналитика и рекламные метки — по задаче",
      "Базовая SEO-подготовка",
      "Настройка инфраструктуры и запуск",
    ],
    process: [
      {
        title: "Задача",
        description:
          "Определяем предложение, аудиторию и действие, которого ждём от посетителя.",
      },
      {
        title: "Страница",
        description:
          "Готовим структуру, тексты и дизайн под рекламный сценарий.",
      },
      {
        title: "Разработка",
        description:
          "Собираем адаптивную страницу, подключаем формы и согласованные интеграции.",
      },
      {
        title: "Запуск",
        description:
          "Проверяем заявки и аналитику, настраиваем домен и публикуем лендинг.",
      },
    ],
    faq: [
      {
        question: "Запуск входит в стоимость?",
        answer:
          "Да. Разработка и запуск — один проект под ключ. Объём работ фиксируем до начала; дальнейшее сопровождение оплачивается отдельно, по желанию.",
      },
      {
        question: "У каждого лендинга будет Telegram-бот?",
        answer:
          "Только если он нужен задаче. Заявки и важные события могут приходить в Telegram; при необходимости бот становится простым интерфейсом управления.",
      },
      {
        question: "Вы также настраиваете рекламные кампании?",
        answer:
          "Готовим сайт к приёму рекламного трафика и подключаем согласованную аналитику. Ведение рекламных кампаний не входит автоматически в разработку лендинга.",
      },
    ],
  },
  "corporate-websites": {
    title: "Корпоративные сайты.",
    eyebrow: "02 / Сайты компаний",
    intro:
      "Помогаем компании понятно рассказать о себе. Объединяем услуги, кейсы и контакты в структуру, в которой посетителю легко найти нужное.",
    outcomes: [
      {
        title: "Понятная структура",
        description:
          "Продумываем разделы и связи между страницами под задачи бизнеса и вопросы клиентов.",
      },
      {
        title: "Доверие к компании",
        description:
          "Показываем реальные услуги, команду и кейсы без выдуманных достижений.",
      },
      {
        title: "Удобные обращения",
        description:
          "Размещаем формы в нужных местах и передаём заявки в согласованные каналы.",
      },
    ],
    deliverables: [
      "Обычно 5–12 страниц; точный объём — под задачу",
      "Услуги, о компании, кейсы и контакты",
      "Вакансии, новости и каталоги — по необходимости",
      "Формы и Telegram- или email-уведомления",
      "Адаптивная вёрстка, метаданные и карта сайта",
      "Инфраструктура и запуск под ключ",
    ],
    process: [
      {
        title: "Структура",
        description:
          "Определяем аудиторию, разделы и содержание каждой страницы.",
      },
      {
        title: "Дизайн",
        description: "Выстраиваем единый визуальный язык и удобную навигацию.",
      },
      {
        title: "Разработка",
        description: "Создаём страницы, формы и необходимые интеграции.",
      },
      {
        title: "Запуск",
        description:
          "Проверяем сайт, готовим техническую SEO-основу и публикуем проект.",
      },
    ],
    faq: [
      {
        question: "Обязательно укладываться в 5–12 страниц?",
        answer:
          "Нет. Это ориентир для типового сайта компании. Количество страниц определяем по содержанию и задачам бизнеса.",
      },
      {
        question: "Можно добавить каталог?",
        answer:
          "Да. Каталог без корзины и онлайн-оплаты может быть частью корпоративного сайта. Для полноценной торговли выбираем интернет-магазин.",
      },
      {
        question: "Будет ли панель управления?",
        answer:
          "Если вам нужно самостоятельно обновлять материалы, согласуем удобный способ управления. Панель не добавляем автоматически.",
      },
    ],
  },
  ecommerce: {
    title: "Интернет-магазины.",
    eyebrow: "03 / Онлайн-продажи",
    intro:
      "Создаём весь путь покупки: от поиска товара до оплаты и обработки заказа. Продумываем удобство и для покупателя, и для команды магазина.",
    outcomes: [
      {
        title: "Удобный выбор",
        description:
          "Категории, карточки товаров, поиск и фильтры помогают найти подходящий товар.",
      },
      {
        title: "Понятная покупка",
        description:
          "Корзина, оформление и оплата объединены в последовательный сценарий.",
      },
      {
        title: "Контроль заказов",
        description:
          "Статусы, уведомления и управление заказами помогают команде работать после запуска.",
      },
    ],
    deliverables: [
      "Категории, каталог и карточки товаров",
      "Поиск и фильтрация",
      "Корзина, оформление заказа и онлайн-оплата",
      "Статусы и управление заказами",
      "Telegram- и email-уведомления — по задаче",
      "Интеграции с доставкой, CRM и API — по необходимости",
      "Тестирование, инфраструктура и запуск",
    ],
    process: [
      {
        title: "Модель магазина",
        description:
          "Разбираемся в товарах, оплате, доставке и обработке заказов.",
      },
      {
        title: "Сценарии",
        description:
          "Проектируем каталог, покупку и работу команды с заказами.",
      },
      {
        title: "Разработка",
        description:
          "Создаём магазин и подключаем согласованные платёжные и внешние сервисы.",
      },
      {
        title: "Запуск",
        description:
          "Проверяем заказы, оплату и уведомления, готовим магазин к работе.",
      },
    ],
    faq: [
      {
        question: "Какие платёжные системы можно подключить?",
        answer:
          "Подбираем провайдера под бизнес и условия проекта: например, ЮKassa, CloudPayments, Platega или другой подходящий сервис.",
      },
      {
        question: "Можно связать магазин с CRM и доставкой?",
        answer:
          "Да. Перед оценкой проверяем доступные API и согласуем, какие данные и события должны передаваться.",
      },
      {
        question: "Сопровождение входит в разработку?",
        answer:
          "Запуск входит в проект. Постоянный мониторинг, обновления и дальнейшее развитие после запуска — отдельная платная опция.",
      },
    ],
  },
} satisfies Record<
  "landing-pages" | "corporate-websites" | "ecommerce",
  PageContent
>
const icons: Record<ServiceId, LucideIcon> = {
  "landing-pages": Globe2,
  "corporate-websites": PanelsTopLeft,
  ecommerce: ShoppingCart,
  telegram: Send,
  support: Wrench,
  other: Lightbulb,
}
export const services = requestServiceIds.map((slug) => {
  const content =
    slug in newPages
      ? newPages[slug as keyof typeof newPages]
      : legacyServices.find((service) => service.slug === slug)!
  return {
    ...content,
    ...serviceCatalog[slug],
    title: content.title,
    slug,
    icon: icons[slug],
    eyebrow:
      slug === "telegram"
        ? "04 / Telegram"
        : slug === "support"
          ? "После запуска"
          : content.eyebrow,
  }
})
export const primaryServices = services.filter(({ slug }) =>
  primaryServiceIds.some((id) => id === slug)
)
export function getService(slug: string) {
  return (
    services.find((service) => service.slug === slug) ??
    legacyServices.find(
      (service) =>
        (service.slug === "desktop" || service.slug === "web-systems") &&
        service.slug === slug
    )
  )
}
export const legacyPageIds = ["desktop", "web-systems"] as const

import type { ServicePageContent } from "@/components/shared/service-page-template"
import { serviceBadges, serviceCatalog } from "@/config/service-catalog"

type AdditionalService = "corporate-websites" | "ecommerce" | "telegram"

const support = {
  title: "2 месяца поддержки включены",
  description: "Техническая помощь и исправление ошибок после запуска. Доработки — по договорённости.",
}

function basics(service: AdditionalService) {
  const item = serviceCatalog[service]
  return {
    service,
    title: item.shortTitle,
    description: item.description,
    badges: serviceBadges[service],
    image: {
      src: `/images/services/covers/${item.image.split("-")[0]}.webp`,
      alt: `Концепт проекта: ${item.shortTitle}`,
    },
    price: item.priceLabel,
    duration: "Срок — после обсуждения задачи",
    support,
    cta: { title: "От идеи до запуска. Останемся на связи.", label: item.cta },
  }
}

export const additionalServiceContent = {
  "corporate-websites": {
    ...basics("corporate-websites"),
    approach: [
      { title: "Понятная структура", visual: "structure", description: "Объединяем услуги, кейсы и контакты. Помогаем клиенту быстро найти нужное и познакомиться с компанией." },
      { title: "Удобно на любом экране", visual: "mobile", description: "Продумываем навигацию, тексты и формы для компьютера и телефона. Сохраняем единый стиль на каждой странице." },
      { title: "Готов к развитию", image: "/images/services/approach/corporate-growth.webp", description: "Создаём основу для новых разделов и интеграций. Оптимизируем изображения и скорость загрузки страниц." },
    ],
    included: [
      { title: "Дизайн и содержание", items: ["Структура разделов и страниц", "Индивидуальный адаптивный дизайн", "Услуги, о компании, кейсы и контакты"] },
      { title: "Заявки и управление", items: ["Формы обращений", "Уведомления в согласованные каналы", "Управление контентом — по задаче"] },
      { title: "Подготовка и запуск", items: ["Базовая подготовка к поиску", "Проверка страниц и форм", "Запуск на вашем домене"] },
    ],
    cta: { title: "Расскажем о вашей компании. Поможем с запуском.", label: serviceCatalog["corporate-websites"].cta },
  },
  ecommerce: {
    ...basics("ecommerce"),
    approach: [
      { title: "Легко найти товар", image: "/images/services/approach/shop-search.webp", description: "Продумываем категории, поиск и фильтры. Показываем в карточке товара всё, что нужно для решения о покупке." },
      { title: "Удобно покупать", image: "/images/services/approach/shop-checkout.webp", description: "Соединяем корзину, оформление и оплату в понятный путь. Уделяем внимание покупкам с телефона." },
      { title: "Готов к заказам", image: "/images/services/approach/shop-orders.webp", description: "Проверяем оплату, статусы и уведомления. Помогаем команде магазина начать работу после запуска." },
    ],
    included: [
      { title: "Витрина", items: ["Каталог и карточки товаров", "Поиск и фильтры", "Адаптивный дизайн"] },
      { title: "Покупка", items: ["Корзина и оформление заказа", "Подключение онлайн-оплаты", "Интеграция доставки — по задаче"] },
      { title: "Работа магазина", items: ["Управление заказами и статусами", "Уведомления и CRM — по задаче", "Проверка покупки и запуск"] },
    ],
    cta: { title: "Откроем ваш магазин. Останемся на связи.", label: serviceCatalog.ecommerce.cta },
  },
  telegram: {
    ...basics("telegram"),
    price: `Бот ${serviceCatalog.telegram.priceLabel}. Mini App — от 40 000 ₽`,
    approach: [
      { title: "Начинаем со сценария", visual: "structure", description: "Разбираемся, что нужно клиентам и команде. Подбираем формат: бот для простых действий или Mini App для полноценного интерфейса." },
      { title: "В привычном Telegram", image: "/images/services/approach/telegram-app.webp", description: "Каталог, запись или заказ доступны внутри мессенджера. Делаем действия понятными, а путь до результата — коротким." },
      { title: "Меньше ручной работы", image: "/images/services/approach/telegram-automation.webp", description: "Связываем заявки, уведомления и ваши сервисы. Проверяем основные сценарии и обработку ошибок перед запуском." },
    ],
    included: [
      { title: "Сценарии и интерфейс", items: ["Логика диалога или экраны Mini App", "Дизайн под задачи проекта", "Каталог, запись или заявки — по задаче"] },
      { title: "Данные и интеграции", items: ["Хранение и обработка данных", "Оплата и CRM — по задаче", "Уведомления для клиентов и команды"] },
      { title: "Подготовка и запуск", items: ["Проверка основных сценариев", "Настройка размещения и запуск", "Передача доступов и инструкции"] },
    ],
    cta: { title: "Запустим проект в Telegram. Останемся рядом.", label: serviceCatalog.telegram.cta },
  },
} satisfies Record<AdditionalService, ServicePageContent>

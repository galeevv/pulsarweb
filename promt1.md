Ты — senior full-stack engineer и software architect. Необходимо с нуля спроектировать и реализовать production-ready сайт небольшой IT-студии **PulsarWeb**.

Проект создаётся локально на **Windows 11** через приложение ChatGPT/Codex.

Это не одноразовый лендинг. Архитектура PulsarWeb должна быть чистой, расширяемой и достаточно универсальной, потому что после финального релиза этого проекта из него будет выделен отдельный шаблон **`pulsar-starter`**, который PulsarWeb будет использовать как основу для будущих клиентских проектов: сайтов, CRM, SaaS, внутренних web-систем и других решений.

При этом не нужно преждевременно превращать PulsarWeb в чрезмерно сложный enterprise-проект. Используй архитектуру ровно настолько сложную, насколько это оправдано текущим продуктом, но не допускай архитектурных решений, которые придётся выбрасывать при дальнейшем развитии.

# 1. Основные требования

Название проекта:

`PulsarWeb`

Позиционирование:

**PulsarWeb — небольшая студия разработки цифровых решений для бизнеса.**

Основная идея:

**Разработка. Запуск. Сопровождение.**

Студия разрабатывает:

- сайты;
- корпоративные сайты;
- лендинги;
- web-системы;
- CRM;
- SaaS;
- личные кабинеты;
- административные панели;
- Telegram-ботов и Telegram-автоматизацию;
- desktop-приложения;
- инфраструктуру и deployment;
- интеграции с внешними сервисами;
- дальнейшее техническое сопровождение.

PulsarWeb может полностью провести проект:

`идея → проектирование → разработка → интеграции → домен → VPS → production → monitoring → дальнейшее сопровождение`

Также PulsarWeb учитывает юридические и технические требования ещё на этапе разработки: privacy, согласия, cookie management, обработку пользовательских данных и другие необходимые для конкретного проекта механизмы.

Не использовать формулировки вроде:

`Полностью гарантируем соответствие законодательству`

или:

`У вас никогда не будет проблем с законом`.

Корректная формулировка:

**«Учитываем требования законодательства и защиты пользовательских данных ещё на этапе разработки.»**

# 2. Дизайн

Визуальный стиль:

**premium minimalism / Apple-like / современный shadcn**

Дизайн должен выглядеть дорого, технологично и спокойно.

Не делать:

- типичный шаблон SaaS;
- чрезмерное количество карточек;
- кислотные градиенты;
- glassmorphism повсюду;
- перегруженные декоративные элементы;
- огромные фоновые blur;
- бессмысленные 3D-объекты;
- дешёвые glowing-кнопки;
- чрезмерную анимацию;
- слишком много текста на первом экране.

Основные визуальные характеристики:

- много воздуха;
- строгая сетка;
- качественная типографика;
- аккуратные border;
- минимальное количество визуального шума;
- премиальная композиция;
- большие заголовки;
- спокойные нейтральные цвета;
- аккуратные hover/focus состояния;
- микровзаимодействия;
- последовательные отступы;
- хорошие mobile layouts;
- native-like ощущения;
- Apple/Shadcn эстетика.

Не копировать Apple буквально. Использовать принципы премиального минимализма.

# 3. Shadcn preset

Дизайн-система проекта должна создаваться строго на базе следующего preset:

```bash
npx shadcn@latest init --preset bbVJxYW --template next --pointer
```

Это базовая дизайн-система PulsarWeb.

Не заменять preset собственной системой цветов или случайными компонентами.

При добавлении shadcn-компонентов сохранять визуальную целостность preset.

Перед созданием собственного UI-компонента сначала проверить, существует ли подходящий primitive/component в текущей shadcn/Base UI системе.

При этом не нужно насильно использовать shadcn для каждой простой обёртки.

# 4. Технологический стек

Использовать:

```text
Next.js
App Router

React

TypeScript
strict mode

Tailwind CSS

shadcn/ui
Base UI

Lucide Icons

Sonner

Zod 4

SQLite

Prisma 7

better-sqlite3 adapter

pnpm
```

Архитектурная модель:

**modular monolith**

Основной принцип:

**бизнес-логика не должна зависеть от Next.js, React, Route Handlers или UI.**

# 5. Database

Для PulsarWeb использовать:

**SQLite + Prisma 7 + better-sqlite3**

SQLite используется сознательно, потому что текущий PulsarWeb не требует PostgreSQL.

Но архитектура database/repository layer должна позволять в будущем перейти на PostgreSQL с минимальными изменениями application/domain слоя.

Нельзя распространять Prisma Client по всему приложению.

Нельзя писать:

```ts
prisma.lead.create(...)
```

прямо внутри React-компонента или Route Handler.

Работа с БД должна быть инкапсулирована.

Пример направления:

```text
Route Handler
    ↓
Application use case
    ↓
Repository interface
    ↓
Prisma implementation
    ↓
SQLite
```

# 6. Архитектурные принципы

Следовать:

- DRY;
- KISS;
- separation of concerns;
- dependency inversion там, где это действительно необходимо;
- composition over inheritance;
- feature/module boundaries;
- server-first подходу Next.js;
- минимизации client components;
- явным контрактам;
- строгой типизации;
- отсутствию скрытых side-effects.

Не создавать абстракции ради абстракций.

Не делать enterprise-style architecture на 100 файлов для простого contact form.

Но бизнес-правила и интеграции должны быть отделены от presentation/framework слоя.

# 7. Главное правило

Одна бизнес-операция должна существовать только в одном месте.

Например обработка заявки клиента не должна отдельно реализовываться:

- на сайте;
- в API;
- в будущем Telegram bot;
- в admin panel.

Должен существовать единый use case:

```text
CreateLead
```

который смогут использовать разные delivery mechanisms.

Пример:

```text
Website
Telegram
Admin
API
        ↓
    CreateLead
        ↓
LeadRepository
Notifications
Email
```

# 8. Предпочтительная структура

Не обязана быть абсолютно идентичной, если в процессе будет найден более грамотный вариант, но направление должно быть примерно таким:

```text
src/
├── app/
│   ├── (marketing)/
│   ├── api/
│   ├── layout.tsx
│   ├── globals.css
│   ├── sitemap.ts
│   ├── robots.ts
│   ├── not-found.tsx
│   └── error.tsx
│
├── components/
│   ├── ui/
│   ├── layout/
│   ├── sections/
│   └── shared/
│
├── modules/
│   ├── leads/
│   │   ├── domain/
│   │   ├── application/
│   │   ├── infrastructure/
│   │   └── index.ts
│   │
│   ├── projects/
│   └── ...
│
├── integrations/
│   ├── email/
│   ├── telegram/
│   └── ...
│
├── lib/
│   ├── db/
│   ├── env/
│   ├── logger/
│   ├── seo/
│   └── utils/
│
├── config/
│
└── types/

prisma/
├── schema.prisma
└── migrations/

public/

scripts/
```

Не создавать пустые директории и искусственные layers, пока они реально не используются.

# 9. Server Components

По умолчанию использовать **React Server Components**.

Добавлять:

```ts
"use client"
```

только когда компонент реально требует:

- browser API;
- state;
- effects;
- interactive UI;
- client-only library.

Не превращать страницы целиком в Client Components из-за одной кнопки или формы.

Интерактивную часть выносить вниз по дереву компонентов.

# 10. Route Handlers

Route Handler должен быть тонким.

Пример:

```text
HTTP Request
↓
Zod validation
↓
Application use case
↓
Result
↓
HTTP Response
```

Route Handler не должен содержать:

- SQL;
- Prisma queries;
- сложные business rules;
- отправку Telegram напрямую;
- отправку email напрямую;
- форматирование большого количества бизнес-данных.

# 11. Zod

Использовать Zod 4 для:

- входящих API payload;
- contact form;
- query parameters;
- env variables;
- внешних webhook payload при появлении;
- runtime boundary validation.

Не дублировать:

```text
TypeScript interface
+
Zod schema
```

если тип можно вывести:

```ts
z.infer<typeof schema>
```

# 12. Environment configuration

Создать строгую и централизованную работу с environment variables.

Например:

```text
src/lib/env/
```

Не использовать хаотичные:

```ts
process.env.SOMETHING
```

по всему проекту.

Environment variables должны валидироваться Zod.

Подготовить:

```text
.env.example
```

Никаких secrets в git.

Интеграции должны корректно работать в optional-режиме.

Например, если Resend или Telegram ещё не настроены, проект должен запускаться локально без падения.

# 13. Интеграции

Архитектура должна позволять подключить:

```text
Resend
Telegram
Platega
другие payment providers
CRM
REST API
webhooks
любые внешние сервисы
```

Использовать adapters.

Например:

```text
EmailProvider

ResendEmailProvider
```

или:

```text
NotificationProvider

TelegramNotificationProvider
```

Application layer не должен зависеть напрямую от SDK Resend или Telegram.

# 14. Contact / Lead system

На первой версии PulsarWeb должна существовать нормальная форма заявки.

Пример данных:

```text
name
company optional
email optional
phone optional
telegram optional
service
budget optional
message
consent
```

Нельзя требовать одновременно email, телефон и Telegram.

Спроектировать адекватное правило контакта.

Например пользователь должен оставить минимум один доступный способ связи.

Все данные валидировать на сервере.

После успешной заявки:

1. сохранить lead в SQLite;
2. при настроенном Telegram уведомить владельца PulsarWeb;
3. при настроенном email provider при необходимости отправить уведомление;
4. вернуть корректный ответ клиенту;
5. показать пользователю Sonner toast / success state.

Не терять заявку из-за того, что Telegram или Resend временно недоступны.

Сохранение lead является основной операцией.

Notification — вторичная операция.

Если уведомление не удалось, заявка всё равно должна остаться в БД.

# 15. Защита формы

Предусмотреть архитектуру для:

- honeypot;
- server-side validation;
- rate limiting;
- защита от повторной отправки;
- безопасное отображение пользовательского текста.

Не подключать тяжёлую CAPTCHA без необходимости.

# 16. Страницы

Минимальная структура:

```text
/
├── Главная
│
├── services/
│   ├── websites
│   ├── web-systems
│   ├── telegram
│   ├── desktop
│   ├── infrastructure
│   └── support
│
├── projects/
│   └── pulsar-cloud
│
├── about
│
├── contacts
│
└── legal/
    ├── privacy
    ├── personal-data-consent
    └── cookies
```

Использовать нормальные semantic URL.

Не делать отдельную страницу ради двух строк текста.

Если раздел логичнее оставить блоком основной страницы — допускается.

# 17. Главная страница

Главная должна выглядеть как дорогая технологическая студия.

Пример структуры:

```text
Header

Hero

Trusted / capabilities marker
или небольшой proof section

Services

Selected project / Pulsar Cloud

What we build

Development process

Technology / capabilities

Infrastructure / full-cycle development

Support

Legal-aware development

About PulsarWeb

CTA / Contact

Footer
```

Не делать 15 одинаковых card-grid секций подряд.

Чередовать композиции.

# 18. Hero

Основной смысл:

**Создаём цифровые продукты для бизнеса.**

Подзаголовок примерно передаёт:

**Сайты, web-системы, автоматизация и инфраструктура — от идеи и разработки до production и дальнейшего сопровождения.**

CTA:

```text
Обсудить проект
```

Дополнительный CTA:

```text
Смотреть проекты
```

Не обязательно использовать именно эти предложения дословно. Улучшить copywriting, сохранив смысл.

# 19. Услуги

Основные направления:

### Разработка сайтов

- landing pages;
- корпоративные сайты;
- каталоги;
- промо;
- коммерческие сервисы;
- платежные сценарии.

### Web-системы

- CRM;
- внутренние системы;
- SaaS;
- dashboards;
- личные кабинеты;
- admin panels;
- системы заявок;
- автоматизация внутренних процессов.

### Telegram

Использовать позиционирование:

**Telegram-автоматизация**

Включает:

- Telegram bots;
- Mini Apps;
- уведомления;
- CRM integrations;
- платежи;
- автоматизацию.

### Desktop

- Windows applications;
- business software;
- utilities;
- internal software;
- API/hardware integrations.

### Infrastructure & Deployment

- VPS;
- Linux;
- Docker;
- reverse proxy;
- HTTPS;
- domains;
- DNS;
- deployment;
- database;
- backups;
- monitoring;
- migrations.

### Сопровождение

- monitoring;
- backups;
- updates;
- исправление ошибок;
- server administration;
- новые функции;
- консультации;
- database maintenance;
- incident response.

# 20. Интеграции

Не делать интеграции отдельным главным направлением.

Показывать как capability PulsarWeb:

**Интегрируем сервисы, которые нужны вашему бизнесу.**

Примеры:

```text
Resend
Telegram
Platega
payment gateways
CRM
REST APIs
webhooks
email providers
internal APIs
```

Архитектура сайта не должна создавать впечатление, что PulsarWeb работает только с перечисленными брендами.

# 21. Pulsar Cloud

Первый реальный кейс:

**Pulsar Cloud / Pulsar VPN**

Создать отдельную premium case-study страницу.

Структура:

```text
Overview

Задача

Решение

Что реализовано

Инфраструктура

Интеграции

Технологии

Screens / UI

Результат
```

Не придумывать ложные показатели:

- количество пользователей;
- выручку;
- конверсию;
- uptime;
- финансовые результаты.

Если фактических данных нет — не писать.

# 22. Контент

Не использовать generic AI-тексты вроде:

`Мы создаём инновационные решения будущего для вашего бизнеса`

или:

`Воплощаем идеи в реальность`.

Текст должен быть:

- коротким;
- конкретным;
- спокойным;
- профессиональным;
- уверенным;
- без дешёвого маркетинга.

PulsarWeb должна ощущаться как технически сильная небольшая студия.

# 23. Премиальный UI

Особое внимание:

- typography hierarchy;
- whitespace;
- vertical rhythm;
- max-width;
- line length;
- section spacing;
- responsive behavior;
- subtle transitions;
- hover;
- focus-visible;
- disabled;
- loading;
- success;
- error.

Не делать огромные border-radius везде.

Не делать каждую секцию карточкой.

Использовать borders и surfaces умеренно.

# 24. Header

Desktop:

```text
PulsarWeb

Услуги
Проекты
О студии
Контакты

Обсудить проект
```

При необходимости использовать dropdown / navigation menu для услуг.

Mobile navigation должна быть полностью удобной с клавиатуры и touch.

Sticky header допустим, если выглядит аккуратно.

# 25. Footer

Footer должен содержать:

```text
PulsarWeb

Услуги

Проекты

Контакты

Legal

Privacy
Personal data consent
Cookies

Copyright
```

Не создавать огромный перегруженный footer.

# 26. Responsive

Проект должен хорошо работать минимум на:

```text
mobile
tablet
laptop
desktop
large desktop
```

Не делать desktop-first страницу, которую потом «ужали».

Проверять самые проблемные разрешения.

Не допускать horizontal overflow.

# 27. Accessibility

Обязательны:

- semantic HTML;
- корректная heading hierarchy;
- keyboard navigation;
- focus-visible;
- aria только там, где нужно;
- label для форм;
- нормальный contrast;
- reduced motion;
- доступное mobile menu;
- доступные Dialog/Sheet/Dropdown;
- понятные validation messages.

Не добавлять ARIA туда, где native HTML уже решает задачу.

# 28. SEO

Сразу заложить:

- metadata;
- title;
- description;
- canonical;
- OpenGraph;
- Twitter metadata при необходимости;
- sitemap;
- robots;
- favicon;
- structured data там, где оправдано;
- правильную семантику;
- server-rendered content.

Metadata не должна дублироваться хаотически.

Создать централизованные SEO helpers/config.

# 29. Performance

Не жертвовать производительностью ради визуальных эффектов.

Использовать:

- next/image;
- next/font или эквивалентную оптимизацию;
- Server Components;
- lazy loading только там, где оправдано;
- минимальный client JS;
- оптимизированные assets.

Не добавлять Framer Motion автоматически.

Если анимацию можно сделать CSS transition — использовать CSS.

Сложную animation library подключать только если она реально даёт необходимый эффект.

# 30. Изображения

Не использовать random stock photos.

Предпочтительно:

- интерфейсы продуктов;
- screenshots;
- device/browser mockups;
- типографические композиции;
- абстрактные product visuals;
- собственные графические элементы.

Не заполнять проект placeholder-картинками плохого качества.

# 31. Legal pages

Создать отдельные маршруты:

```text
/legal/privacy
/legal/personal-data-consent
/legal/cookies
```

На данном этапе допускается placeholder content с явной пометкой для последующей юридической проверки, если точные реквизиты или финальный текст ещё неизвестны.

Нельзя выдумывать:

- ФИО;
- ИНН;
- адрес;
- email;
- юридические реквизиты.

Вместо этого использовать типизированную конфигурацию или явно помеченные placeholders.

# 32. Cookie banner

Архитектура должна позволять отображать корректный cookie/privacy banner при появлении аналитики или необязательных cookies.

Не показывать бессмысленный:

`Мы используем cookies, нажмите OK`

если фактически согласие ни на что не влияет.

Consent state должен быть функциональным.

# 33. Код

Требования:

- TypeScript strict;
- никаких необоснованных `any`;
- минимальное количество type assertions;
- никаких огромных компонентов на 500+ строк;
- никакого copy-paste;
- никаких duplicated constants;
- никаких duplicated section containers;
- никаких duplicated button styles;
- никаких duplicated validation schemas;
- никаких duplicated business rules.

Общие layout primitives должны переиспользоваться.

Но не создавать `UniversalEverythingComponent` с 40 props.

# 34. Компоненты

Хорошие кандидаты на shared primitives:

```text
Container
Section
SectionHeader
PageHeader
Logo
SiteHeader
SiteFooter
CTA
ContactForm
ProjectPreview
ServiceNavigation
```

Но создавать их только при реальной необходимости.

Если компонент используется только один раз и не представляет самостоятельную концепцию — необязательно выносить его искусственно.

# 35. Constants / configuration

Не размазывать по JSX:

```text
PulsarWeb
email
navigation
services
social links
company information
```

Создать централизованную конфигурацию.

Например:

```text
src/config/site.ts
src/config/navigation.ts
src/config/services.ts
```

Не создавать один гигантский `constants.ts`.

# 36. Imports

Использовать понятные aliases.

Например:

```ts
@/components
@/modules
@/lib
@/config
```

Не создавать глубокие импорты вида:

```ts
../../../../../../lib/utils
```

# 37. Public API модулей

Не импортировать случайные внутренние файлы feature/module из других модулей.

Если модуль требует публичного API — использовать `index.ts` осмысленно.

Но не создавать barrel files в каждой директории автоматически.

# 38. Error handling

Создать последовательную модель ошибок.

Различать:

- validation error;
- business/domain error;
- infrastructure error;
- unexpected error.

Не отправлять пользователю raw stack traces.

На сервере логировать достаточно контекста для диагностики.

Не логировать secrets.

Не логировать чувствительные пользовательские данные без необходимости.

# 39. Logging

Создать простой structured logger abstraction.

В production лог должен легко читаться системой обработки логов.

Пример:

```json
{
  "level": "info",
  "event": "lead.created",
  "leadId": "...",
  "requestId": "..."
}
```

Не нужно сразу подключать сложный observability SaaS.

Но код не должен состоять из хаотичных:

```ts
console.log(...)
```

# 40. Health endpoint

Добавить минимальный endpoint:

```text
/api/health
```

Он должен позволять проверить состояние web-приложения.

При необходимости можно проверить доступность SQLite, но endpoint не должен выполнять дорогую операцию.

# 41. Testing

Не стремиться к бессмысленному 100% coverage.

Покрыть важное.

Использовать:

```text
Vitest
Playwright
```

Минимально:

- Zod schemas;
- business/application logic;
- lead creation;
- repository;
- критичный contact flow.

Playwright:

```text
открыть сайт
→ открыть форму
→ заполнить
→ отправить
→ получить success
```

# 42. Lint / Format / Typecheck

Проект должен иметь команды:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

При необходимости:

```bash
pnpm test:e2e
```

Перед завершением задачи обязательно выполнить:

```text
lint
typecheck
tests
production build
```

Исправить найденные ошибки.

Не считать задачу завершённой, если build падает.

# 43. README

Создать качественный:

```text
README.md
```

Содержание:

```text
PulsarWeb

Requirements

Installation

Environment

Development

Database

Prisma migrations

Testing

Production build

Project structure

Architecture principles
```

Команды должны работать на Windows 11 / PowerShell.

Не использовать в README только bash-specific конструкции, если есть простой cross-platform вариант.

# 44. Windows 11

Поскольку разработка ведётся локально на Windows 11:

- не использовать shell scripts как единственный способ запуска проекта;
- основные dev/build/database команды должны быть доступны через `package.json`;
- не предполагать наличие Linux utilities;
- корректно работать с Windows paths;
- избегать platform-specific hacks;
- использовать Node.js scripts для cross-platform automation, если требуется.

# 45. Package manager

Использовать:

```text
pnpm
```

Не смешивать:

```text
npm
yarn
pnpm
```

В репозитории должен быть один lockfile.

# 46. Git

Создать грамотный `.gitignore`.

Не коммитить:

```text
.env
.env.local
SQLite runtime DB
generated temporary data
logs
build output
```

Prisma migrations должны коммититься.

# 47. SQLite

Хранение dev database организовать предсказуемо.

Не класть production data в Git.

Не создавать несколько случайных `.db` файлов по проекту.

Database path должен задаваться централизованно.

# 48. Миграции

Schema changes проводить через Prisma migrations.

Не использовать подход:

`поменяли schema.prisma и надеемся, что production как-нибудь обновится`.

Проект должен быть подготовлен к воспроизводимому deployment.

# 49. Security

Минимум:

- server-side validation;
- safe error responses;
- environment validation;
- secure headers;
- отсутствие secrets в client bundle;
- отсутствие доверия client input;
- rate limiting architecture;
- безопасные redirects;
- корректная работа external links;
- `rel` где требуется.

Не заниматься security theatre.

# 50. Будущий pulsar-starter

Очень важное ограничение.

**Сейчас не создавать отдельный `pulsar-starter`.**

Сначала должен быть полностью завершён PulsarWeb.

Но при реализации постоянно учитывать, что после релиза из проекта будут извлечены универсальные части:

```text
design system

layout primitives

env validation

database setup

Prisma conventions

forms

validation

logging

SEO

health endpoint

integration adapters

testing setup

deployment conventions

project structure
```

Не создавать generic framework раньше времени.

PulsarWeb остаётся реальным продуктом.

После его стабилизации reusable foundation будет выделен отдельно.

# 51. Что НЕ нужно реализовывать сейчас

Без отдельной необходимости не создавать:

```text
authentication
RBAC
полноценную CMS
CRM PulsarWeb
admin dashboard
customer dashboard
billing
Redis
RabbitMQ
Kafka
BullMQ
microservices
Kubernetes
GraphQL
tRPC
сложный event bus
отдельный backend server
worker infrastructure
```

Если текущей версии сайта это не требуется.

Но архитектура не должна препятствовать добавлению этих возможностей в будущем.

# 52. Фоновые задачи

Для текущего сайта отдельный worker не нужен, если реальной фоновой нагрузки нет.

Не создавать worker «на будущее».

Если позже PulsarWeb действительно потребуются:

- retry;
- asynchronous notifications;
- payments;
- webhooks;
- тяжёлые операции;

тогда можно реализовать transactional outbox + отдельный Node.js worker.

Сейчас соблюдаем YAGNI.

# 53. Обязательное отсутствие дублирования

Перед добавлением нового кода всегда проверить:

1. нет ли уже компонента для этой задачи;
2. нет ли уже Zod schema;
3. нет ли уже helper;
4. нет ли уже design primitive;
5. нет ли уже business use case;
6. нет ли уже интеграционного adapter;
7. нельзя ли решить задачу существующей архитектурой.

Но не объединять сущности только потому, что у них случайно похожи несколько строк кода.

DRY относится прежде всего к знаниям и правилам системы, а не к механическому совпадению кода.

# 54. Работа по этапам

Реализацию выполнять последовательно.

## Stage 1 — bootstrap

- создать проект;
- применить указанный shadcn preset;
- настроить TypeScript;
- установить зависимости;
- проверить dev/build.

## Stage 2 — foundation

- project structure;
- env;
- site config;
- typography;
- layout;
- header;
- footer;
- Container/Section;
- metadata;
- robots;
- sitemap;
- error/not-found.

## Stage 3 — database

- Prisma 7;
- SQLite;
- better-sqlite3 adapter;
- migrations;
- DB abstraction.

Статус на 07.10.2026: реализован. Prisma 7.10.0 + SQLite через
`@prisma/adapter-better-sqlite3`; схема и начальная миграция находятся в `prisma/`.
CLI и приложение используют общие правила `DATABASE_URL` и загрузки `.env*`.
Подключение ленивое, с повторным использованием при hot reload; Prisma изолирован
в DB/infrastructure, application зависит от `LeadRepository` и `RateLimiter`.
Добавлены `db:validate`, `db:status`, `db:migrate`, `db:deploy`, `db:generate`.
Интеграционные проверки покрывают создание БД миграциями с нуля, отсутствие drift,
повторный deploy, сохранность данных после переподключения и откат транзакций.
Порядок работы и ограничения SQLite описаны в README. Stage 4 проверяется отдельно.

## Stage 4 — lead module

- domain/application boundary;
- repository;
- Prisma repository;
- Zod;
- contact use case;
- API endpoint;
- form.

Статус на 07.10.2026: реализован. Единый `CreateLead` валидирует вход, сохраняет
заявку через `LeadRepository` / `PrismaLeadRepository` и отделяет результат
сохранения от уведомлений. HTTP-контракт выделен отдельно от domain, границы
зависимостей проверяет ESLint. Общая Zod-схема используется формой и сервером;
минимум один контакт и явное согласие обязательны. Тонкий `POST /api/leads`
поддерживает honeypot, лимит тела, rate limiting, request ID и идемпотентность.
Форма на shadcn/Base UI с Lucide сохраняет ввод при ошибках, блокирует повторное
нажатие и показывает success state / Sonner toast. Добавлен `pnpm test:e2e`:
production-сервер и миграции на временной БД, без внешних уведомлений.
Проверено: 77 unit/integration-тестов, 10 браузерных сценариев, TypeScript,
lint и production build. Внешние интеграции остаются предметом Stage 5.

## Stage 5 — integrations

- notification abstraction;
- Telegram adapter;
- email abstraction;
- Resend adapter;
- graceful optional configuration.

Статус на 07.10.2026: реализован. `LeadNotification` и `EmailProvider` отделяют
use case от Telegram Bot API и Resend HTTP API. Каналы подключаются независимо;
пустая конфигурация отключает канал, неполная или некорректная — отключает его
с безопасным предупреждением, сохраняя доступность сайта и приём заявок.
Добавлены валидация ответов, deadline 8 секунд, безопасные категории ошибок
и один идемпотентный повтор Resend при временных сбоях. Telegram не повторяется
автоматически. Сохраняются `skipped` / `sent` / `partial` / `failed`; уведомления
не отменяют запись заявки. Настройка, ограничения и семантика статусов описаны
в README и `.env.example`. Проверено: 107 unit/integration-тестов,
10 браузерных сценариев с неполными настройками, TypeScript, lint и production
build. Сеть провайдеров в тестах подменена; реальные сообщения не отправлялись.

## Stage 6 — marketing UI

- Homepage;
- Services;
- Projects;
- Pulsar Cloud case;
- About;
- Contacts;
- Legal.

Статус на 07.10.2026: интерфейсы реализованы. Главная включает направления,
проект, процесс, технологии, интеграции, сопровождение, работу с данными и CTA.
Готовы список и шесть страниц услуг, Projects, About, Contacts и три legal route.
Повторяющиеся блоки услуг, процесса и обложки проекта вынесены в общие компоненты.
Используются исходный shadcn preset и Lucide; маркетинговые страницы остаются
Server Components. Форма на мобильных экранах предшествует поясняющему блоку;
обе CTA услуги сохраняют выбранное направление. У legal есть содержание,
навигация, возврат к форме и `noindex`.

По решению владельца фактические материалы Pulsar Cloud будут актуализированы
позже. Пока опубликована структура с пометкой «Кейс готовится к публикации»;
функции, стек, инфраструктура, интеграции, скриншоты и результаты не выдумываются.
Legal остаётся проектом документов до подтверждения реквизитов и условий.
Проверены production build, TypeScript, lint, форматирование, 107 unit/integration
и 14 E2E-сценариев, включая адаптивность 320/768/1440 px, навигацию услуг,
клавиатурный FAQ, юридические документы и отправку формы в изолированную БД.

## Stage 7 — refinement

- responsiveness;
- accessibility;
- SEO;
- animations — дополнительные анимации исключены по решению владельца; сохранить встроенные состояния shadcn и reduced motion;
- performance;
- error states;
- empty/loading states.

Статус на 07.10.2026: реализован. Проверены ширины 320–1920 px и короткий
мобильный экран; увеличены области нажатия полей и кнопок переходов.
Исправлен контраст подсказок и невалидных полей, усилен focus-visible.
Добавлены загрузка контактов через shadcn Skeleton, live status отправки,
фокус и pending-состояние общей ошибки, Empty для неопубликованных скриншотов.
Исправлено наследование OG/Twitter-обложки на внутренних страницах;
незавершённый кейс имеет `noindex` и не включается в sitemap до публикации.
Toaster загружается только в разделе контактов; маркетинговые страницы
сохраняют серверный рендеринг. Новых анимаций и runtime-зависимостей нет.

Добавлен axe в devDependencies и браузерные проверки WCAG A/AA,
клавиатурной навигации, reduced motion, SEO, 404, загрузки и восстановления
формы после ошибки. Исключение для служебных focus guards Base UI и границы
проверки описаны в README. Итог: 107 unit/integration и 24 E2E-сценария,
TypeScript, lint, форматирование и production build. Материалы кейса и
утверждение legal по-прежнему ожидают фактических данных владельца.

## Stage 8 — tests

- unit;
- integration;
- E2E critical flow.

Статус на 07.10.2026: завершён. Проверено существующее покрытие и добавлены
существенные сценарии: глобальный rate limit и его отказ, сквозная цепочка
HTTP → SQLite → настроенные Telegram/Resend-адаптеры с подменой только внешней
сети, сохранение до уведомления, статусы доставки, безопасные логи и повтор
после переподключения. В E2E добавлены конкурентные повторы и сохранение формы
при открытии legal в отдельных вкладках. Итого: 112 unit/integration-тестов
и 26 E2E-сценариев. Отдельно 10 сценариев формы проходят с неполными
фиктивными настройками Telegram/email. Рабочая БД и реальные провайдеры
в тестах не используются.

## Stage 9 — verification

Выполнить:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

и исправить все проблемы.

Статус на 07.10.2026: завершён. Все четыре команды выполнены успешно;
также проходит `pnpm format:check`. Исправлена несогласованность окружения
E2E: build и сервер теперь получают один SITE_URL и одинаковую изолированную
конфигурацию; SEO-тест проверяет origin canonical и OG/Twitter-изображений.
После E2E выполнен обычный `pnpm build` с настройками проекта.
Дальнейшее наполнение Pulsar Cloud и утверждение legal остаются за владельцем
согласно ранее согласованному порядку; технические проверки не означают
публикацию сайта или проверку доставки реальных уведомлений.

# 55. Правила работы агента

Не спрашивать подтверждение на каждом мелком шаге.

Принимать инженерные решения самостоятельно в рамках требований.

Если есть несколько вариантов:

1. выбрать наиболее простой production-grade вариант;
2. объяснить нетривиальное решение кратким комментарием или документацией;
3. не создавать ненужную сложность.

Перед установкой новой зависимости определить:

- действительно ли она нужна;
- нельзя ли решить задачу средствами Next.js/React/Node/shadcn;
- является ли библиотека зрелой;
- оправдывает ли она дополнительную поверхность поддержки.

Не устанавливать десятки библиотек ради небольшого удобства.

# 56. Кодовые комментарии

Не писать комментарии, которые повторяют код.

Плохо:

```ts
// Create lead
const lead = await createLead()
```

Комментарии нужны только для:

- нетривиального архитектурного решения;
- workaround;
- security-related reasoning;
- сложного алгоритма;
- ограничения внешнего API.

# 57. Definition of Done

PulsarWeb v1 считается готовым только если:

- проект запускается локально;
- production build проходит;
- TypeScript не содержит ошибок;
- lint проходит;
- ключевые тесты проходят;
- navigation работает;
- mobile версия качественная;
- формы работают;
- lead сохраняется;
- optional integrations не ломают приложение;
- legal routes существуют;
- SEO foundation настроена;
- нет явного дублирования;
- нет архитектурно бессмысленных abstractions;
- нет placeholder lorem ipsum;
- нет случайных stock images;
- нет выдуманных данных о компании;
- README позволяет другому разработчику запустить проект;
- кодовая база пригодна для дальнейшего развития и последующего выделения `pulsar-starter`.

# 58. Конечный результат

Нужен не prototype и не концепт.

Нужно создать качественную, чистую и реально поддерживаемую кодовую базу **PulsarWeb**, которая выглядит как premium digital studio и одновременно демонстрирует инженерный уровень самой студии.

Если потенциальный технический клиент откроет исходный код проекта, архитектура должна усиливать доверие к PulsarWeb, а не разрушать его.

Приоритеты в таком порядке:

```text
1. Корректность
2. Простота архитектуры
3. Поддерживаемость
4. Отсутствие дублирования
5. UX/UI качество
6. Accessibility
7. Performance
8. Расширяемость
9. Только затем дополнительные abstractions
```

Начни с создания проекта с нуля.

Сначала изучи требования целиком, затем реализуй фундамент, и только после этого переходи к страницам и визуальному наполнению.

Не заменяй архитектурную работу генерацией большого количества однотипного UI.

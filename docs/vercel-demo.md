# Демо на Vercel и production на VPS

`vercel.json` включает NEXT_PUBLIC_DEMO_MODE=true при сборке и запуске только на Vercel. В этом режиме показана плашка DEMO, отправка заявок отключена в интерфейсе и API, индексация закрыта через robots.txt и X-Robots-Tag.

## Vercel

Импортировать galeevv/pulsarweb, ветка codex/snapshot-2026-10-25. Framework: Next.js. Root: ./, Node.js: 24.x. Install: pnpm install --frozen-lockfile. Build: pnpm build. Output: по умолчанию.

Задать SITE_URL=https://ИМЯ-ПРОЕКТА.vercel.app. Не переносить локальные env-файлы и Telegram-секреты. После изменения SITE_URL повторить Deploy.

## VPS

Откат исходников не нужен. Установить NEXT_PUBLIC_DEMO_MODE=false до сборки; настроить SITE_URL, DATABASE_URL и Telegram на сервере. Установить зависимости, выполнить pnpm db:generate, pnpm db:deploy, pnpm build, pnpm start. SQLite хранить на постоянном диске с резервными копиями.

vercel.json не влияет на обычный запуск на VPS. Не переносить готовую демосборку: NEXT_PUBLIC-переменные встраиваются при сборке. Проверить сохранение реальной заявки и уведомление после запуска.

Snapshot до деморежима: e34def724ee073177dd9247dd8a6962e9435c65b.

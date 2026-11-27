# UI foundations

shadcn Base UI / base-maia remains the primitive layer. Semantic colors and typography live in globals.css. Container and Section own page width and section spacing.

Marketing surfaces use marketing-surface / --marketing-radius (24px mobile, 32px from 640px). Main section headings use home-section-title. Small CTA headings intentionally remain smaller. Primary actions use ButtonLink at 48px; compact navigation actions are intentional exceptions.

HomeBadge is the padded feature badge; plain outline Badge is compact metadata. These are intentional variants, not competing foundations.

ProjectPageTemplate owns project scope, palette, screen gallery and technology layout; pages supply content, hero and closing CTA slots. Services use ServicePageTemplate. MarketingHero is intentionally fullscreen/promotional, while detail heroes use image cards.

DetailLoading appears only while route content is pending. Static media placeholders indicate missing assets, not loading. Existing start loading, validation, pending, success and error states remain. WebGL failure keeps the static background and readable content.

## Кнопки и карточки проектов — 26 ноября 2026

- `ButtonLink` задаёт маркетинговым CTA высоту 48 px и боковые отступы 24 px, включая кнопки со стрелкой. Локальные классы отвечают за ширину и размещение. Кнопки меню, закрытия и прочие служебные контролы сохраняют свои размеры.
- Стрелки оставляем в карточках услуг/проектов, включая hero-карточки, и внутри `/start`. В навигационном CTA шапки, обычных промоблоках и завершающих CTA стрелок нет. Кнопки с ценой на главной и страницах услуг также без стрелок.
- `src/config/projects.ts` — единый список проектов для главной, каталога и sitemap. Чтобы добавить кейс, создайте его страницу и обложку, затем запись с уникальными `id`/`href`, `releaseYear` и `casePublished: true`. Черновики с `casePublished: false` не отображаются в списках и sitemap.
- `HomeProjectCard` сохраняет общий внешний вид. В каталоге заголовок карточки — H2, внутри секции главной — H3. Бейдж на обложке показывает год релиза.

Mobile hero height is owned by CSS, without competing Tailwind min-height utilities. Verify expanded/collapsed Safari bars and landscape on a real iPhone before release.

## Изображения

- `public/images/services/covers/` — обложки каталога и страниц услуг.
- `public/images/services/approach/` — иллюстрации блоков «Наш подход».
- `public/images/benefits/` — иллюстрации преимуществ на главной.
- `public/images/projects/pulsar-vpn/` и `public/images/projects/pulsar-web/` — материалы кейсов.

Будущие мокапы для раздела «Интерфейс» кейса PulsarWeb складывать в `public/images/projects/pulsar-web/screens/`. Рекомендуемый формат — WebP 4:3, 1600×1200 px. Каждый мокап подключается через поле `image` с `src` и `alt` в соответствующей карточке. Пока файлов нет, видны заглушки.

| Карточка | Имя файла |
| --- | --- |
| Главная | `home.webp` |
| Каталог услуг | `services.webp` |
| Страница услуг | `landing-pages.webp` |
| Каталог проектов | `projects.webp` |
| Страница проекта | `pulsar-vpn.webp` |
| О студии | `about.webp` |
| Контакты | `contacts.webp` |
| Заявка на проект | `start.webp` |
| Правовая информация | `legal.webp` |


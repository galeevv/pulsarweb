import Image from "next/image"
import { Section } from "@/components/layout/section"
import { PageHeader } from "@/components/shared/page-header"
import { ButtonLink } from "@/components/shared/button-link"
import { CTA } from "@/components/shared/cta"
import { Badge } from "@/components/ui/badge"
import { pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata(
  "FORM — дизайн-концепт",
  "Концепт лендинга коллекции интерьерных объектов: геометрия, тактильные материалы и минималистичная типографика.",
  "/projects/form"
)

export default function FormProjectPage() {
  return (
    <>
      <PageHeader
        eyebrow="Лендинг / Концепт"
        title="FORM"
        description="Предметный дизайн через простые формы. Визуальное исследование сайта коллекции интерьерных объектов."
      />
      <Section className="pt-0 md:pt-0">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <Badge variant="secondary">Концепт</Badge>
          <ButtonLink href="/projects" variant="outline">
            Все проекты
          </ButtonLink>
        </div>
        <Image
          src="/images/projects/form-16x9.webp"
          alt="Визуальный концепт сайта FORM на мониторе: сфера, куб и терракотовое кольцо."
          width={1600}
          height={900}
          className="aspect-video w-full rounded-3xl object-cover"
        />
        <p className="mt-4 text-sm text-muted-foreground">
          Концептуальная визуализация, созданная с помощью AI. FORM —
          вымышленный бренд; это не клиентский заказ и не запущенный сайт.
        </p>
      </Section>
      <Section className="bg-muted/40">
        <div className="grid gap-10 md:grid-cols-3">
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-medium">Идея</h2>
            <p className="leading-relaxed text-muted-foreground">
              Показать интерьерные объекты через геометрию и материалы. Сделать
              сам продукт главным героем первого экрана.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-medium">Визуальный язык</h2>
            <p className="leading-relaxed text-muted-foreground">
              Молочный фон, графитовая типографика, терракотовый акцент. Крупный
              заголовок, свободная сетка и мягкие скругления.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-medium">Состав концепта</h2>
            <p className="leading-relaxed text-muted-foreground">
              Первый экран, навигация и превью коллекций. Представлена
              визуальная идея; разработка, интеграции и коммерческие результаты
              не заявляются.
            </p>
          </div>
        </div>
      </Section>
      <CTA
        title="Сайт для вашего продукта"
        description="Разработаем визуальную подачу и превратим её в работающий сайт под задачи бизнеса."
      />
    </>
  )
}

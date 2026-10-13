import { PageHeader } from "@/components/shared/page-header"
import { Section } from "@/components/layout/section"
import { ButtonLink } from "@/components/shared/button-link"
export const metadata: Metadata = {
  title: "Страница не найдена",
  alternates: { canonical: null },
  robots: { index: false, follow: true },
}
export default function NotFound() {
  return (
    <>
      <PageHeader
        eyebrow="404 / Страница не найдена"
        title="Кажется, мы свернули не туда."
        description="Страница могла переехать или адрес указан с ошибкой. Вернитесь на главную — там всё на месте."
      />
      <Section className="pt-0">
        <ButtonLink href="/" className="min-h-11">
          <ArrowLeft data-icon="inline-start" />
          На главную
        </ButtonLink>
      </Section>
    </>
  )
}
import type { Metadata } from "next"
import { ArrowLeft } from "lucide-react"

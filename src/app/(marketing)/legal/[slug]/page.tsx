import Link from "next/link"
import { notFound } from "next/navigation"
import { FileText, ArrowLeft } from "lucide-react"
import { ButtonLink } from "@/components/shared/button-link"

import { Section } from "@/components/layout/section"
import { PageHeader } from "@/components/shared/page-header"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import {
  getLegalDocument,
  legalDocuments,
  legalDraftNotice,
} from "@/config/legal"
import { pageMetadata } from "@/lib/seo"

type LegalPageProps = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return legalDocuments.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: LegalPageProps) {
  const { slug } = await params
  const document = getLegalDocument(slug)
  if (!document) notFound()
  return {
    ...pageMetadata(
      document.title,
      document.description,
      `/legal/${document.slug}`
    ),
    robots: { index: false, follow: true },
  }
}

export default async function LegalPage({ params }: LegalPageProps) {
  const { slug } = await params
  const document = getLegalDocument(slug)
  if (!document) notFound()

  return (
    <>
      <PageHeader
        eyebrow="Правовая информация"
        title={document.title.replace(
          "конфиденциальности",
          "конфиден\u00adциальности"
        )}
        description={document.description}
      />
      <Section className="pt-0 md:pt-0">
        <div className="grid gap-12 lg:grid-cols-[1fr_2fr] lg:gap-20">
          <div className="flex flex-col items-start gap-10 lg:sticky lg:top-28 lg:self-start">
            <nav
              aria-label="Правовые документы"
              className="flex flex-col items-start gap-5"
            >
              {legalDocuments.map((item) => (
                <Link
                  key={item.slug}
                  href={`/legal/${item.slug}`}
                  aria-current={
                    item.slug === document.slug ? "page" : undefined
                  }
                  className="text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring aria-[current=page]:text-foreground aria-[current=page]:underline"
                >
                  {item.title}
                </Link>
              ))}
            </nav>
            <nav
              aria-label="Содержание документа"
              className="flex flex-col gap-3"
            >
              <p className="eyebrow mb-2">В этом документе</p>
              {document.sections.map((section, index) => (
                <Link
                  key={section.title}
                  href={`#legal-section-${index}`}
                  className="max-w-xs py-1 text-sm leading-relaxed text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                >
                  {index + 1}. {section.title}
                </Link>
              ))}
            </nav>
          </div>
          <article className="flex min-w-0 flex-col gap-12">
            <Alert role="note">
              <FileText aria-hidden="true" />
              <AlertTitle>Документ не утверждён</AlertTitle>
              <AlertDescription>{legalDraftNotice}</AlertDescription>
            </Alert>
            {document.sections.map((section, index) => (
              <section
                key={section.title}
                className="flex flex-col gap-5"
                aria-labelledby={`legal-section-${index}`}
              >
                <h2
                  id={`legal-section-${index}`}
                  className="text-xl font-medium tracking-tight"
                >
                  {index + 1}. {section.title}
                </h2>
                {section.paragraphs.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="leading-relaxed text-muted-foreground"
                  >
                    {paragraph}
                  </p>
                ))}
              </section>
            ))}
            <Separator />
            <p className="text-sm leading-relaxed text-muted-foreground">
              Редакция для подготовки к запуску. Финальный документ должен
              соответствовать фактическим процессам обработки данных.
            </p>
            <ButtonLink
              href="/start"
              variant="outline"
              className="self-start"
            >
              <ArrowLeft data-icon="inline-start" aria-hidden="true" />
              Вернуться к форме
            </ButtonLink>
          </article>
        </div>
      </Section>
    </>
  )
}

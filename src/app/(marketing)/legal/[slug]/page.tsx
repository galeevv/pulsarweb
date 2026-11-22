import type { ReactNode } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronDown } from "lucide-react"
import { Section } from "@/components/layout/section"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { getLegalDocument, legalDocuments } from "@/config/legal"
import { pageMetadata } from "@/lib/seo"

type LegalPageProps = { params: Promise<{ slug: string }> }

export const dynamicParams = false

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
      "/legal/" + document.slug
    ),
    robots: { index: false, follow: true },
  }
}

const email = "support@pulsarweb.dev"
const focusClass =
  "rounded-md outline-offset-4 focus-visible:outline-2 focus-visible:outline-ring"

function legalText(text: string): ReactNode {
  return text
    .split(/(\*\*[^*\n]+\*\*|`[^`\n]+`|support@pulsarweb\.dev)/g)
    .map((part, index) => {
      if (part.startsWith("**")) {
        return (
          <strong key={index} className="font-semibold text-foreground">
            {legalText(part.slice(2, -2))}
          </strong>
        )
      }
      if (part.startsWith("`")) {
        return (
          <code
            key={index}
            className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.875em] wrap-anywhere text-foreground"
          >
            {part.slice(1, -1)}
          </code>
        )
      }
      if (part === email) {
        return (
          <a
            key={index}
            href={"mailto:" + email}
            className={
              focusClass +
              " wrap-anywhere underline decoration-border underline-offset-4 hover:decoration-current"
            }
          >
            {part}
          </a>
        )
      }
      return part
    })
}

function LegalBlock({ block }: { block: string }) {
  if (block.startsWith("### ")) {
    return (
      <h3 className="mt-2 text-base font-semibold text-foreground">
        {block.slice(4)}
      </h3>
    )
  }
  if (block.startsWith("- ")) {
    return (
      <ul className="flex list-disc flex-col gap-1.5 ps-5 marker:text-muted-foreground">
        {block.split("\n").map((item) => (
          <li key={item}>{legalText(item.slice(2))}</li>
        ))}
      </ul>
    )
  }
  return (
    <p className="whitespace-pre-line">
      {legalText(
        block.replace(/ *\n/g, (line) => (line.length > 2 ? "\n" : " "))
      )}
    </p>
  )
}

export default async function LegalPage({ params }: LegalPageProps) {
  const { slug } = await params
  const document = getLegalDocument(slug)
  if (!document) notFound()

  const contents = (
    <nav aria-label="Содержание документа">
      <ol className="flex flex-col gap-1">
        {document.sections.map(({ id, title }) => (
          <li key={id}>
            <a
              href={"#" + id}
              className={
                focusClass +
                " block py-1.5 text-sm leading-snug text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              }
            >
              {title}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )

  return (
    <Section
      className="pt-10 pb-16 md:pt-16 md:pb-24"
      aria-labelledby="legal-title"
    >
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(14rem,17rem)_minmax(0,1fr)] lg:gap-10 xl:gap-14">
        <Card className="marketing-surface min-w-0 lg:sticky lg:top-28 lg:max-h-[calc(100dvh-8rem)] lg:overflow-y-auto">
          <CardContent className="flex flex-col gap-4">
            <nav aria-label="Правовые документы">
              <ul className="flex flex-col gap-1">
                {legalDocuments.map((item) => (
                  <li key={item.slug}>
                    <Link
                      href={"/legal/" + item.slug}
                      aria-current={
                        item.slug === document.slug ? "page" : undefined
                      }
                      className={
                        focusClass +
                        " block px-3 py-2 text-sm leading-snug text-muted-foreground hover:bg-muted hover:text-foreground aria-[current=page]:bg-muted aria-[current=page]:font-medium aria-[current=page]:text-foreground"
                      }
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <Separator />
            <details className="group lg:hidden">
              <summary
                className={
                  focusClass +
                  " flex cursor-pointer list-none items-center justify-between gap-3 py-1 font-medium [&::-webkit-details-marker]:hidden"
                }
              >
                Содержание
                <ChevronDown
                  className="size-4 shrink-0 text-muted-foreground group-open:rotate-180"
                  aria-hidden="true"
                />
              </summary>
              <div className="mt-3">{contents}</div>
            </details>
            <div className="hidden flex-col gap-2 lg:flex">
              <p className="font-medium">Содержание</p>
              {contents}
            </div>
          </CardContent>
        </Card>

        <Card className="marketing-surface min-w-0 [--card-spacing:--spacing(5)] sm:[--card-spacing:--spacing(8)] xl:[--card-spacing:--spacing(10)]">
          <CardContent>
            <article className="flex max-w-[72ch] flex-col gap-9 text-base leading-relaxed text-foreground/85">
              <header className="flex min-w-0 flex-col items-start gap-3 md:gap-4">
                <h1
                  id="legal-title"
                  className="home-section-title wrap-break-word hyphens-auto text-foreground"
                >
                  {document.title}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {document.lastUpdated}
                </p>
              </header>
              {document.introduction.length > 0 && (
                <div className="flex flex-col gap-4">
                  {document.introduction.map((block) => (
                    <LegalBlock key={block} block={block} />
                  ))}
                </div>
              )}
              {document.sections.map(({ id, title, blocks }) => (
                <section
                  key={id}
                  aria-labelledby={id}
                  className="flex flex-col gap-4"
                >
                  <h2
                    id={id}
                    className="scroll-mt-28 text-xl leading-tight font-semibold tracking-tight text-foreground sm:text-2xl"
                  >
                    {title}
                  </h2>
                  {blocks.map((block) => (
                    <LegalBlock key={block} block={block} />
                  ))}
                </section>
              ))}
            </article>
          </CardContent>
        </Card>
      </div>
    </Section>
  )
}

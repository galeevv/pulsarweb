import "server-only"

import { readFileSync } from "node:fs"
import path from "node:path"

export const legalDocuments = [
  {
    slug: "privacy",
    label: "Политика обработки данных",
    file: "privacy.md",
    description:
      "Какие персональные данные обрабатывает PulsarWeb и как обратиться к оператору.",
  },
  {
    slug: "personal-data-consent",
    label: "Согласие на обработку данных",
    file: "personal.md",
    description:
      "Условия согласия на обработку персональных данных при отправке заявки.",
  },
  {
    slug: "cookies",
    label: "Политика использования cookie",
    file: "cookies.md",
    description:
      "Как PulsarWeb использует cookie, локальное хранение и веб-аналитику.",
  },
] as const

export function getLegalDocument(slug: string) {
  const document = legalDocuments.find((item) => item.slug === slug)
  if (!document) return undefined

  const source = readFileSync(
    path.join(process.cwd(), "docs", document.file),
    "utf8"
  )
    .replace(/\r\n/g, "\n")
    .trim()
  const [header, ...sections] = source.split(/\n(?=## )/)
  const [title, lastUpdated, ...introduction] = header.split(/\n{2,}/)

  if (
    !title.startsWith("# ") ||
    !lastUpdated?.startsWith("Дата последнего обновления: ") ||
    !sections.length
  ) {
    throw new Error("Invalid legal document: " + document.file)
  }

  return {
    ...document,
    title: title.slice(2),
    lastUpdated,
    introduction,
    sections: sections.map((section, index) => {
      const [heading, ...blocks] = section.trim().split(/\n{2,}/)
      return { id: "legal-section-" + index, title: heading.slice(3), blocks }
    }),
  }
}

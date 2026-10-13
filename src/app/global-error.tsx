"use client"

import { ErrorState } from "@/components/shared/error-state"
import { site } from "@/config/site"
import "./globals.css"

export default function GlobalError({
  retry,
}: {
  error: Error & { digest?: string }
  retry: () => void
}) {
  return (
    <html lang={site.language}>
      <head>
        <title>Временная ошибка — {site.name}</title>
        <meta name="robots" content="noindex" />
      </head>
      <body style={{ fontFamily: "system-ui, sans-serif" }}>
        <main>
          <ErrorState retry={retry} />
        </main>
      </body>
    </html>
  )
}

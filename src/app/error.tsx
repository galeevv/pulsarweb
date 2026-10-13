"use client"
import { ErrorState } from "@/components/shared/error-state"
export default function ErrorPage({
  retry,
}: {
  error: Error & { digest?: string }
  retry: () => void
}) {
  return (
    <>
      <title>Временная ошибка — PulsarWeb</title>
      <meta name="robots" content="noindex" />
      <ErrorState retry={retry} />
    </>
  )
}

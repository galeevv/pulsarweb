"use client"

import { useEffect, useRef, useState, type FormEvent } from "react"
import { toast } from "sonner"
import { createLeadSchema, leadApiResponseSchema } from "@/modules/leads"

export function useContactSubmission() {
  const formRef = useRef<HTMLFormElement>(null)
  const feedbackRef = useRef<HTMLDivElement>(null)
  const attemptRef = useRef<{ id: string; signature: string } | null>(null)
  const pendingRef = useRef(false)
  const focusOnResetRef = useRef(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const [complete, setComplete] = useState(false)

  useEffect(() => {
    if (Object.keys(fieldErrors).length) {
      formRef.current
        ?.querySelector<HTMLElement>('[aria-invalid="true"]')
        ?.focus()
    } else if (error || complete) {
      feedbackRef.current?.focus()
    } else if (focusOnResetRef.current) {
      focusOnResetRef.current = false
      formRef.current
        ?.querySelector<HTMLInputElement>('input[name="name"]')
        ?.focus()
    }
  }, [fieldErrors, error, complete])

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pendingRef.current) return

    const formData = new FormData(event.currentTarget)
    const submissionId = attemptRef.current?.id ?? crypto.randomUUID()
    const parsed = createLeadSchema.safeParse({
      ...Object.fromEntries(formData),
      consent: formData.get("consent") === "on",
      submissionId,
    })

    setError(null)
    if (!parsed.success) {
      const errors: Record<string, string[]> = {}
      for (const issue of parsed.error.issues) {
        const field = String(issue.path[0])
        errors[field] = [...(errors[field] ?? []), issue.message]
      }
      setFieldErrors(errors)
      return
    }

    // A lost response can follow a successful save. Reuse its key until the payload changes.
    const signature = JSON.stringify({
      ...parsed.data,
      submissionId: undefined,
    })
    if (!attemptRef.current || attemptRef.current.signature !== signature) {
      attemptRef.current = { id: crypto.randomUUID(), signature }
    }

    setFieldErrors({})
    pendingRef.current = true
    setPending(true)

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...parsed.data,
          submissionId: attemptRef.current.id,
        }),
        signal: AbortSignal.timeout(20_000),
      })
      const result = leadApiResponseSchema.parse(await response.json())

      if (!response.ok || !result.ok) {
        if (!result.ok) {
          setFieldErrors(result.error.fieldErrors ?? {})
          setError(result.error.message)
        } else {
          setError(
            "Не удалось отправить заявку. Попробуйте ещё раз чуть позже."
          )
        }
        return
      }

      attemptRef.current = null
      setComplete(true)
      toast.success("Заявка отправлена", {
        description: "Свяжемся с вами по указанным контактам.",
      })
    } catch {
      setError(
        "Не удалось получить ответ. Поля формы сохранены. Проверьте соединение и повторите отправку."
      )
    } finally {
      pendingRef.current = false
      setPending(false)
    }
  }

  function reset() {
    attemptRef.current = null
    focusOnResetRef.current = true
    setComplete(false)
    setError(null)
    setFieldErrors({})
  }

  return {
    formRef,
    feedbackRef,
    fieldErrors,
    error,
    pending,
    complete,
    submit,
    reset,
  }
}

"use client"

import { useEffect, useRef, useState, type FormEvent } from "react"
import Link from "next/link"
import {
  Globe2,
  PanelsTopLeft,
  Send,
  ShoppingCart,
  Wrench,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Check,
  UserRound,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"
import { ButtonLink } from "@/components/shared/button-link"
import { cn } from "@/lib/utils"
import {
  createLeadSchema,
  leadServiceIds,
  type RequestService,
  type CreateLeadInput,
} from "../domain/schema"
import { projectRequestConfig } from "../domain/request-config"
import { leadApiResponseSchema } from "../contracts"

const icons = {
  "landing-pages": Globe2,
  "corporate-websites": PanelsTopLeft,
  telegram: Send,
  ecommerce: ShoppingCart,
  support: Wrench,
  other: Sparkles,
}
const steps = ["Тип проекта", "Контакты"]
const stepFields = [["service"], ["name", "telegram", "email", "consent"]]

type Draft = Omit<CreateLeadInput, "service" | "consent" | "submissionId"> & {
  service?: RequestService
  consent: boolean
}
type Attribution = Pick<
  CreateLeadInput,
  "sourceUrl" | "referrer" | "utmSource" | "utmMedium" | "utmCampaign"
>

export function ProjectRequestWizard({
  initialService,
  attribution,
  telegramUrl,
}: {
  initialService?: RequestService
  attribution: Attribution
  telegramUrl: string
}) {
  const [step, setStep] = useState(initialService ? 1 : 0)
  const [draft, setDraft] = useState<Draft>({
    service: initialService,
    description: "",
    name: "",
    company: "",
    companyContext: "",
    projectReference: "",
    telegram: "",
    email: "",
    phone: "",
    consent: false,
    website: "",
  })
  const [pointerMotion, setPointerMotion] = useState(false)
  const [contact, setContact] = useState("")
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [error, setError] = useState<string>()
  const [pending, setPending] = useState(false)
  const [publicId, setPublicId] = useState<string>()
  const formRef = useRef<HTMLFormElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const feedbackRef = useRef<HTMLDivElement>(null)
  const focusRequested = useRef(false)
  const validationFocusRequested = useRef(false)
  const pendingRef = useRef(false)
  const attemptRef = useRef<{ id: string; signature: string } | null>(null)
  const sourceRef = useRef(attribution)

  useEffect(() => {
    sourceRef.current = {
      ...attribution,
      sourceUrl:
        attribution.sourceUrl ??
        `${location.pathname}${location.search}`.slice(0, 2048),
      referrer: document.referrer.slice(0, 2048) || undefined,
    }
  }, [attribution])
  useEffect(() => {
    if (validationFocusRequested.current) {
      formRef.current
        ?.querySelector<HTMLElement>('[aria-invalid="true"]')
        ?.focus()
      validationFocusRequested.current = false
    } else if (focusRequested.current) {
      headingRef.current?.focus()
      focusRequested.current = false
    }
  }, [step, errors])
  useEffect(() => {
    if (
      (error || publicId) &&
      !formRef.current?.querySelector('[aria-invalid="true"]')
    )
      feedbackRef.current?.focus()
  }, [error, publicId])

  function update<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((current) => ({ ...current, [key]: value }))
    setErrors((current) => {
      const next = { ...current }
      delete next[key]
      return next
    })
  }
  function go(next: number) {
    setErrors({})
    setError(undefined)
    focusRequested.current = true
    setStep(next)
  }
  function parse() {
    return createLeadSchema.safeParse({
      ...draft,
      ...sourceRef.current,
      phone: undefined,
      email:
        contact.trim().includes("@") && !contact.trim().startsWith("@")
          ? contact.trim()
          : undefined,
      telegram:
        contact.trim().includes("@") && !contact.trim().startsWith("@")
          ? undefined
          : contact.trim(),
      submissionId: attemptRef.current?.id ?? crypto.randomUUID(),
    })
  }
  function validate(all = false) {
    const parsed = parse()
    if (parsed.success) {
      setErrors({})
      return parsed.data
    }
    const selected = parsed.error.issues.filter(
      (issue) => all || stepFields[step].includes(String(issue.path[0]))
    )
    // Object-level schema refinements may be skipped when consent is invalid.
    // Validate the required contact independently so all errors appear together.
    if (
      (all || step === 1) &&
      !contact.trim() &&
      !selected.some((issue) => issue.path[0] === "telegram")
    ) {
      selected.push({
        code: "custom",
        path: ["telegram"],
        message: "Укажите почту или Telegram",
      })
    }
    if (!selected.length) {
      setErrors({})
      return true
    }
    const nextErrors: Record<string, string[]> = {}
    for (const issue of selected) {
      const key = String(issue.path[0])
      nextErrors[key] = [...(nextErrors[key] ?? []), issue.message]
    }
    validationFocusRequested.current = true
    setErrors(nextErrors)
    if (all) {
      const invalidStep = stepFields.findIndex((fields) =>
        fields.includes(String(selected[0].path[0]))
      )
      if (invalidStep >= 0) setStep(invalidStep)
    }
    return false
  }
  async function submit(event: FormEvent) {
    event.preventDefault()
    if (pendingRef.current) return
    if (step < 1) {
      if (validate()) go(step + 1)
      return
    }
    const data = validate(true)
    if (!data || data === true) return
    const signature = JSON.stringify({ ...data, submissionId: undefined })
    if (!attemptRef.current || attemptRef.current.signature !== signature)
      attemptRef.current = { id: crypto.randomUUID(), signature }
    pendingRef.current = true
    setPending(true)
    setError(undefined)
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, submissionId: attemptRef.current.id }),
        signal: AbortSignal.timeout(20_000),
      })
      const result = leadApiResponseSchema.parse(await response.json())
      if (!result.ok) {
        const fieldErrors = result.error.fieldErrors ?? {}
        const invalidStep = stepFields.findIndex((fields) =>
          fields.some((field) => fieldErrors[field]?.length)
        )
        if (invalidStep >= 0) setStep(invalidStep)
        validationFocusRequested.current = invalidStep >= 0
        setErrors(fieldErrors)
        setError(result.error.message)
        return
      }
      if (!response.ok) throw new Error("Unexpected response")
      setPublicId(result.publicId)
    } catch {
      setError(
        "Не удалось получить ответ. Данные сохранены в форме. Проверьте соединение и повторите отправку."
      )
    } finally {
      pendingRef.current = false
      setPending(false)
    }
  }
  function textField(
    key:
      "name" | "company" | "telegram" | "phone" | "email" | "projectReference",
    label: string,
    maxLength: number,
    autoComplete?: string,
    type = "text"
  ) {
    return (
      <Field key={key} data-invalid={!!errors[key]?.length}>
        <FieldLabel htmlFor={key}>{label}</FieldLabel>
        <Input
          id={key}
          name={key}
          required={key === "name"}
          aria-required={key === "name"}
          type={type}
          className="min-h-11"
          value={draft[key] ?? ""}
          onChange={(e) => update(key, e.target.value)}
          maxLength={maxLength}
          autoComplete={autoComplete}
          aria-invalid={!!errors[key]?.length}
          aria-describedby={errors[key]?.length ? `${key}-error` : undefined}
        />
        <FieldError id={`${key}-error`}>{errors[key]?.join(" ")}</FieldError>
      </Field>
    )
  }
  const title = step === 0 ? "Что хотите создать?" : "Как с вами связаться?"
  const StepIcon = step === 0 ? Sparkles : UserRound
  const contactErrors = [...(errors.email ?? []), ...(errors.telegram ?? [])]

  if (publicId)
    return (
      <div
        ref={feedbackRef}
        tabIndex={-1}
        className="request-success flex flex-col items-center gap-6 px-2 pt-10 pb-2 text-center outline-none"
        data-motion={pointerMotion}
        role="status"
      >
        <div className="flex size-16 items-center justify-center rounded-2xl border border-border/70 bg-background">
          <Check className="size-6" aria-hidden="true" />
        </div>
        <p className="eyebrow">{publicId}</p>
        <h1 className="text-3xl font-medium tracking-tight sm:text-4xl">
          Заявка отправлена
        </h1>
        <p className="max-w-lg leading-relaxed text-muted-foreground">
          Скоро свяжемся с вами.
        </p>
        <div className="flex w-full flex-col gap-3">
          <ButtonLink href="/">Вернуться на главную</ButtonLink>
          <ButtonLink href={telegramUrl} variant="outline">
            Написать напрямую в Telegram
          </ButtonLink>
        </div>
      </div>
    )

  return (
    <form
      ref={formRef}
      onSubmit={submit}
      data-motion={pointerMotion}
      onPointerDownCapture={() => setPointerMotion(true)}
      onKeyDownCapture={() => setPointerMotion(false)}
      noValidate
      aria-label="Заявка на проект"
      aria-busy={pending}
      className="flex min-h-[520px] flex-col gap-6"
    >
      <ol aria-label="Этапы заявки" className="grid grid-cols-2 gap-2">
        {steps.map((label, index) => (
          <li
            key={label}
            aria-current={index === step ? "step" : undefined}
            className={cn(
              "h-1 rounded-full",
              index <= step ? "bg-foreground" : "bg-muted"
            )}
          >
            <span className="sr-only">
              {index + 1}. {label}
            </span>
          </li>
        ))}
      </ol>
      <div
        key={`heading-${step}`}
        className="request-step flex flex-col items-center gap-4 py-2 text-center"
      >
        <div className="flex size-16 items-center justify-center rounded-2xl border border-border/70 bg-background">
          <StepIcon className="size-6" aria-hidden="true" />
        </div>
        <div className="flex flex-col items-center gap-2">
          <h1
            ref={headingRef}
            tabIndex={-1}
            className="text-2xl leading-tight font-medium tracking-tight outline-none sm:text-3xl"
          >
            {title}
          </h1>
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            {step === 0
              ? "Выберите направление. Детали обсудим вместе."
              : "Свяжемся и обсудим проект."}
          </p>
        </div>
      </div>
      <fieldset key={step} disabled={pending} className="request-step min-w-0">
        <FieldGroup>
          {step === 0 && (
            <Field data-invalid={!!errors.service?.length}>
              <FieldLabel id="service-label" className="sr-only">
                Тип проекта
              </FieldLabel>
              <ToggleGroup
                aria-labelledby="service-label"
                aria-invalid={!!errors.service?.length}
                aria-describedby="service-error"
                tabIndex={-1}
                variant="outline"
                value={draft.service ? [draft.service] : []}
                onValueChange={(values) => {
                  const service = values[0] as RequestService | undefined
                  update("service", service)
                }}
                className="grid w-full grid-cols-2 gap-3"
              >
                {leadServiceIds
                  .filter((service) => service !== "support")
                  .map((service) => {
                    const item = projectRequestConfig[service]
                    const Icon = icons[service]
                    return (
                      <ToggleGroupItem
                        key={service}
                        value={service}
                        aria-label={item.title}
                        className={cn(
                          "h-auto min-h-20 w-full min-w-0 flex-col gap-2 rounded-2xl px-3 py-4 whitespace-normal",
                          service === "other" && "col-span-2 min-h-14 flex-row"
                        )}
                      >
                        <Icon data-icon="inline-start" aria-hidden="true" />
                        <span>{item.title}</span>
                      </ToggleGroupItem>
                    )
                  })}
              </ToggleGroup>
              <FieldError id="service-error">
                {errors.service?.join(" ")}
              </FieldError>
            </Field>
          )}
          {step === 1 && (
            <>
              {textField("name", "Имя", 100, "name")}
              <Field data-invalid={contactErrors.length > 0}>
                <FieldLabel htmlFor="contact">Почта или Telegram</FieldLabel>
                <Input
                  id="contact"
                  name="contact"
                  className="min-h-11"
                  value={contact}
                  onChange={(event) => {
                    setContact(event.target.value)
                    setErrors((current) => {
                      const next = { ...current }
                      delete next.email
                      delete next.telegram
                      return next
                    })
                  }}
                  placeholder="you@example.com или @username"
                  maxLength={254}
                  required
                  aria-required="true"
                  autoComplete="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  aria-invalid={contactErrors.length > 0}
                  aria-describedby={
                    contactErrors.length ? "contact-error" : undefined
                  }
                />
                <FieldError id="contact-error">
                  {contactErrors.length
                    ? "Укажите корректную почту или Telegram в формате @username"
                    : null}
                </FieldError>
              </Field>
              <Field
                orientation="horizontal"
                data-invalid={!!errors.consent?.length}
              >
                <Checkbox
                  id="consent"
                  checked={draft.consent}
                  onCheckedChange={(checked) => update("consent", checked)}
                  aria-invalid={!!errors.consent?.length}
                  aria-describedby="consent-error"
                />
                <div className="flex flex-col gap-2">
                  <FieldLabel htmlFor="consent">
                    Я соглашаюсь на обработку персональных данных.
                  </FieldLabel>
                  <Link
                    href="/legal/personal-data-consent"
                    target="_blank"
                    className="text-sm text-muted-foreground underline underline-offset-4"
                  >
                    Условия обработки данных
                  </Link>
                  <FieldError id="consent-error">
                    {errors.consent?.join(" ")}
                  </FieldError>
                </div>
              </Field>
            </>
          )}
        </FieldGroup>
      </fieldset>
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="website">Ваш сайт</label>
        <input
          id="website"
          name="website"
          value={draft.website}
          onChange={(e) => update("website", e.target.value)}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      {error && (
        <Alert variant="destructive" ref={feedbackRef} tabIndex={-1}>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <span role="status" className="sr-only">
        {pending ? "Отправляем заявку. Пожалуйста, подождите." : ""}
      </span>
      <div className={cn("mt-auto grid gap-3 pt-2", step > 0 && "grid-cols-2")}>
        {step > 0 ? (
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="h-12 rounded-2xl"
            disabled={pending}
            onClick={() => go(step - 1)}
          >
            <ArrowLeft data-icon="inline-start" />
            <span>Назад</span>
          </Button>
        ) : null}
        <Button
          type="submit"
          disabled={pending}
          size="lg"
          className="h-12 rounded-2xl"
        >
          {pending ? (
            <>
              <Spinner data-icon="inline-start" aria-hidden="true" />
              <span>Отправляем…</span>
            </>
          ) : step === 1 ? (
            <span>Отправить заявку</span>
          ) : (
            <>
              <span>Далее</span>
              <ArrowRight data-icon="inline-end" />
            </>
          )}
        </Button>
      </div>
    </form>
  )
}

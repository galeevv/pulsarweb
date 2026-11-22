"use client"

import { useEffect, useRef, useState, type FormEvent } from "react"
import Link from "next/link"
import {
  Globe2,
  FileText,
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
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  Field,
  FieldGroup,
  FieldContent,
  FieldLabel,
  FieldError,
} from "@/components/ui/field"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { HomeHeroSurface } from "@/components/shared/home-hero-surface"
import { PulsarMark } from "@/components/shared/logo"
import { Spinner } from "@/components/ui/spinner"
import { ButtonLink } from "@/components/shared/button-link"
import { cn } from "@/lib/utils"
import { getFirstTouchAttribution } from "@/lib/attribution"
import { trackFunnelEvent } from "@/lib/analytics"
import { getCookieConsent } from "@/lib/cookie-consent"
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
const stepFields = [
  ["service"],
  ["name", "telegram", "email", "description", "consent"],
]

type Draft = Omit<CreateLeadInput, "service" | "consent" | "submissionId"> & {
  service?: RequestService
  consent: boolean
}
type Attribution = Pick<
  CreateLeadInput,
  | "sourceUrl"
  | "landingPage"
  | "referrer"
  | "utmSource"
  | "utmMedium"
  | "utmCampaign"
  | "utmContent"
  | "utmTerm"
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
  const [step, setStep] = useState(initialService ? 1 : -1)
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
  const [detailsOpen, setDetailsOpen] = useState(false)
  const detailsRef = useRef<HTMLTextAreaElement>(null)
  useEffect(() => {
    if (detailsOpen) detailsRef.current?.focus()
  }, [detailsOpen])
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
  const openedRef = useRef(false)
  const begunRef = useRef(false)
  const completedRef = useRef(false)

  useEffect(() => {
    if (!openedRef.current) {
      openedRef.current = true
      trackFunnelEvent({ name: "start_opened", service: initialService })
    }
  }, [initialService])

  function markBegun(service = draft.service) {
    if (begunRef.current) return
    begunRef.current = true
    trackFunnelEvent({ name: "start_begun", service })
  }

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
    if (key !== "website") {
      markBegun(key === "service" ? (value as RequestService) : draft.service)
    }
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
      ...(getCookieConsent() === "accepted" ? getFirstTouchAttribution() : undefined),
      sourceUrl: (attribution.sourceUrl ?? location.pathname).split(/[?#]/, 1)[0].slice(0, 2048),
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
    if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
      setError("Демоверсия: заявки не отправляются и не сохраняются.")
      return
    }
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
      if (!completedRef.current) {
        completedRef.current = true
        trackFunnelEvent({ name: "start_completed", service: draft.service })
      }
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
          placeholder={key === "name" ? "Ваше имя" : undefined}
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

  if (step === -1)
    return (
      <div className="flex flex-col gap-6">
        <div className="-mx-4 -mt-4 overflow-hidden rounded-t-3xl border-b border-border sm:-mx-6 sm:-mt-6">
          <HomeHeroSurface>
            <div className="flex h-44 items-center justify-center sm:h-50">
              <PulsarMark size={112} />
            </div>
          </HomeHeroSurface>
        </div>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1
            ref={headingRef}
            tabIndex={-1}
            className="text-2xl font-medium tracking-tight outline-none sm:text-3xl"
          >
            Обсудим ваш проект?
          </h1>
          <p className="text-sm text-muted-foreground">
            Выберите удобный способ связи.
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <Button
            type="button"
            size="lg"
            variant="outline"
            className="h-12 w-full rounded-2xl"
            onClick={() => go(0)}
          >
            <FileText data-icon="inline-start" aria-hidden="true" />
            <span className="flex-1 text-left">Оставить заявку</span>
            <ArrowRight data-icon="inline-end" aria-hidden="true" />
          </Button>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Separator />
            </div>
            <span className="text-xs text-muted-foreground">или</span>
            <div className="flex-1">
              <Separator />
            </div>
          </div>
          <ButtonLink
            href={telegramUrl}
            variant="outline"
            className="h-12 w-full rounded-2xl"
          >
            <Send data-icon="inline-start" aria-hidden="true" />
            <span className="flex-1 text-left">Написать разработчику</span>
            <ArrowRight data-icon="inline-end" aria-hidden="true" />
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
                          "h-auto min-h-20 w-full min-w-0 flex-col gap-2 rounded-2xl px-3 py-4 whitespace-normal aria-pressed:bg-accent aria-pressed:text-accent-foreground aria-pressed:border-muted-foreground aria-pressed:hover:bg-accent aria-pressed:hover:text-accent-foreground",
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
                    markBegun()
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
              {detailsOpen ? (
                <Field data-invalid={!!errors.description?.length}>
                  <FieldLabel htmlFor="description">Дополнительно</FieldLabel>
                  <Textarea
                    ref={detailsRef}
                    id="description"
                    name="description"
                    rows={4}
                    maxLength={5000}
                    value={draft.description}
                    onChange={(event) =>
                      update("description", event.target.value)
                    }
                    placeholder="Всё, что важно знать о задаче — ссылки, бюджет, сроки, пожелания"
                    aria-invalid={!!errors.description?.length}
                    aria-describedby={
                      errors.description?.length
                        ? "description-error"
                        : undefined
                    }
                  />
                  <FieldError id="description-error">
                    {errors.description?.join(" ")}
                  </FieldError>
                </Field>
              ) : (
                <Button
                  type="button"
                  variant="link"
                  className="h-auto justify-start self-start p-0 text-muted-foreground"
                  onClick={() => setDetailsOpen(true)}
                >
                  + Уточнить задачу
                </Button>
              )}
              <Field
                orientation="horizontal"
                data-invalid={!!errors.consent?.length}
              >
                <Checkbox
                  id="consent"
                  className="size-6 rounded-md after:-inset-2.5 [&_svg]:size-4"
                  aria-labelledby="consent-label"
                  required
                  checked={draft.consent}
                  onCheckedChange={(checked) => update("consent", checked)}
                  aria-invalid={!!errors.consent?.length}
                  aria-describedby="consent-error"
                />
                <FieldContent>
                  <p
                    id="consent-label"
                    className="text-sm leading-relaxed text-muted-foreground"
                  >
                    Соглашаюсь на{" "}
                    <Link
                      href="/legal/personal-data-consent"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-4"
                    >
                      обработку персональных данных
                    </Link>{" "}
                    и{" "}
                    <Link
                      href="/legal/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-4"
                    >
                      политику конфиденциальности
                    </Link>
                    .
                  </p>
                  <FieldError id="consent-error">
                    {errors.consent?.join(" ")}
                  </FieldError>
                </FieldContent>
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
      <div className="mt-auto grid grid-cols-2 gap-3 pt-2">
        {step >= 0 ? (
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

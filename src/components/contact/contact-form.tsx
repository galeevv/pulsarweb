"use client"

import { useState, type ComponentProps } from "react"
import Link from "next/link"
import { ArrowUpRight, Check, CircleAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Spinner } from "@/components/ui/spinner"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { CreateLeadInput } from "@/modules/leads"
import { useContactSubmission } from "./use-contact-submission"

type ServiceOption = { value: CreateLeadInput["service"]; label: string }
type ContactFormProps = {
  services: readonly ServiceOption[]
  initialService?: CreateLeadInput["service"]
}

type TextFieldProps = Pick<
  ComponentProps<typeof Input>,
  "name" | "type" | "autoComplete" | "placeholder" | "maxLength" | "required"
> & { label: string; error?: string }

function TextField({ label, error, name, ...props }: TextFieldProps) {
  const id = `contact-${name}`
  return (
    <Field data-invalid={Boolean(error)}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Input
        id={id}
        name={name}
        className="min-h-11"
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        {...props}
      />
      {error && <FieldError id={`${id}-error`}>{error}</FieldError>}
    </Field>
  )
}

export function ContactForm({ services, initialService }: ContactFormProps) {
  const [service, setService] = useState<string | null>(initialService ?? null)
  const [consent, setConsent] = useState(false)
  const {
    formRef,
    feedbackRef,
    fieldErrors: errors,
    error,
    pending,
    complete,
    submit,
    reset,
  } = useContactSubmission()
  const serviceItems = [
    { value: null, label: "Выберите направление" },
    ...services,
  ]

  if (complete) {
    return (
      <div
        ref={feedbackRef}
        tabIndex={-1}
        className="flex flex-col gap-6 outline-none"
      >
        <Alert role="status">
          <Check aria-hidden="true" />
          <AlertTitle>Спасибо. Заявка у нас.</AlertTitle>
          <AlertDescription>
            Изучим задачу и свяжемся с вами по указанным контактам, чтобы
            обсудить детали и следующий шаг.
          </AlertDescription>
        </Alert>
        <Button
          variant="outline"
          className="self-start"
          onClick={() => {
            setService(initialService ?? null)
            setConsent(false)
            reset()
          }}
        >
          Отправить ещё одну заявку
        </Button>
      </div>
    )
  }

  return (
    <>
      <p role="status" className="sr-only">
        {pending ? "Отправляем заявку. Пожалуйста, подождите." : ""}
      </p>
      <form
        ref={formRef}
        method="post"
        action="/api/leads"
        onSubmit={submit}
        noValidate
        aria-busy={pending}
        aria-label="Заявка на проект"
      >
        <FieldGroup className="gap-9">
          <FieldSet disabled={pending}>
            <FieldLegend>О вас</FieldLegend>
            <FieldGroup className="grid gap-6 sm:grid-cols-2">
              <TextField
                name="name"
                label="Ваше имя"
                autoComplete="name"
                placeholder="Как к вам обращаться"
                maxLength={100}
                required
                error={errors.name?.[0]}
              />
              <TextField
                name="company"
                label="Компания · необязательно"
                autoComplete="organization"
                placeholder="Название компании"
                maxLength={160}
                error={errors.company?.[0]}
              />
            </FieldGroup>
          </FieldSet>

          <FieldSet disabled={pending}>
            <FieldLegend>Как с вами связаться</FieldLegend>
            <FieldDescription>
              Достаточно одного способа связи: email, телефона или Telegram.
            </FieldDescription>
            <FieldGroup className="gap-6">
              <TextField
                name="email"
                label="Email"
                type="email"
                autoComplete="email"
                placeholder="you@company.ru"
                maxLength={254}
                error={errors.email?.[0]}
              />
              <FieldGroup className="grid gap-6 sm:grid-cols-2">
                <TextField
                  name="phone"
                  label="Телефон"
                  type="tel"
                  autoComplete="tel"
                  placeholder="+7"
                  maxLength={40}
                  error={errors.phone?.[0]}
                />
                <TextField
                  name="telegram"
                  label="Telegram"
                  autoComplete="off"
                  placeholder="@username"
                  maxLength={64}
                  error={errors.telegram?.[0]}
                />
              </FieldGroup>
            </FieldGroup>
          </FieldSet>

          <FieldSet disabled={pending}>
            <FieldLegend>О проекте</FieldLegend>
            <FieldGroup className="gap-6">
              <Field
                data-invalid={Boolean(errors.service)}
                data-disabled={pending}
              >
                <FieldLabel htmlFor="contact-service">Направление</FieldLabel>
                <Select
                  name="service"
                  items={serviceItems}
                  value={service}
                  onValueChange={setService}
                  disabled={pending}
                >
                  <SelectTrigger
                    id="contact-service"
                    className="min-h-11 w-full"
                    aria-invalid={Boolean(errors.service)}
                    aria-required="true"
                    aria-describedby={
                      errors.service ? "contact-service-error" : undefined
                    }
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {services.map((item) => (
                        <SelectItem
                          key={item.value}
                          value={item.value}
                          className="min-h-11"
                        >
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {errors.service && (
                  <FieldError id="contact-service-error">
                    {errors.service[0]}
                  </FieldError>
                )}
              </Field>
              <TextField
                name="budget"
                label="Бюджет · необязательно"
                placeholder="Ориентир или диапазон, если он уже есть"
                maxLength={100}
                error={errors.budget?.[0]}
              />
              <Field data-invalid={Boolean(errors.message)}>
                <FieldLabel htmlFor="contact-message">
                  Что хотите сделать?
                </FieldLabel>
                <Textarea
                  id="contact-message"
                  name="message"
                  rows={5}
                  className="min-h-36 resize-y"
                  placeholder="Какую задачу решаем, для кого и к какому сроку? Ссылки на примеры тоже пригодятся."
                  maxLength={5000}
                  required
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={
                    errors.message ? "contact-message-error" : undefined
                  }
                />
                {errors.message && (
                  <FieldError id="contact-message-error">
                    {errors.message[0]}
                  </FieldError>
                )}
              </Field>
            </FieldGroup>
          </FieldSet>

          <Field className="hidden" aria-hidden="true">
            <FieldLabel htmlFor="contact-website">Ваш сайт</FieldLabel>
            <Input
              id="contact-website"
              name="website"
              autoComplete="off"
              tabIndex={-1}
            />
          </Field>

          <Field
            data-invalid={Boolean(errors.consent)}
            data-disabled={pending}
            orientation="horizontal"
          >
            <Checkbox
              id="contact-consent"
              name="consent"
              value="on"
              checked={consent}
              onCheckedChange={setConsent}
              disabled={pending}
              aria-invalid={Boolean(errors.consent)}
              aria-required="true"
              aria-describedby={
                errors.consent
                  ? "contact-consent-error"
                  : "contact-consent-description"
              }
            />
            <FieldContent>
              <FieldLabel htmlFor="contact-consent">
                Согласен на обработку персональных данных
              </FieldLabel>
              <FieldDescription id="contact-consent-description">
                На условиях{" "}
                <Link
                  href="/legal/personal-data-consent"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  согласия
                </Link>{" "}
                и{" "}
                <Link
                  href="/legal/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  политики конфиденциальности
                </Link>
                . Документы откроются в новой вкладке.
              </FieldDescription>
              {errors.consent && (
                <FieldError id="contact-consent-error">
                  {errors.consent[0]}
                </FieldError>
              )}
            </FieldContent>
          </Field>

          {error && (
            <div ref={feedbackRef} tabIndex={-1} className="outline-none">
              <Alert variant="destructive">
                <CircleAlert aria-hidden="true" />
                <AlertTitle>Не получилось отправить</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </div>
          )}

          <Button
            type="submit"
            size="lg"
            disabled={pending}
            className="h-12 w-full sm:w-fit"
          >
            {pending ? (
              <Spinner data-icon="inline-start" aria-hidden="true" />
            ) : null}
            {pending ? "Отправляем…" : "Отправить заявку"}
            {!pending && (
              <ArrowUpRight data-icon="inline-end" aria-hidden="true" />
            )}
          </Button>
          <noscript>
            <p>Для отправки формы включите JavaScript в настройках браузера.</p>
          </noscript>
        </FieldGroup>
      </form>
    </>
  )
}

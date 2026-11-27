import { Gift, MessageCircle, Send } from "lucide-react"
import { Section } from "@/components/layout/section"
import { ButtonLink } from "@/components/shared/button-link"
import { getTelegramOwnerContact } from "@/lib/env/server"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { SupportCoinsBackground } from "@/components/shared/support-coins-background"

import { SupportConversation } from "@/components/shared/support-conversation"

export function WhyPulsarWeb() {
  return (
    <Section id="why-pulsarweb" aria-labelledby="support-title">
      <h2 id="support-title" className="home-section-title mb-12 max-w-4xl text-balance md:mb-16">
        Запустили сайт.<br />Остаёмся на связи.
      </h2>
      <div className="grid gap-6 lg:grid-cols-5 lg:gap-y-8">
        <Card className="marketing-surface relative isolate gap-8 lg:row-span-3 lg:grid lg:grid-rows-subgrid bg-foreground text-background ring-0 [--card-spacing:--spacing(8)] sm:[--card-spacing:--spacing(10)] lg:col-span-2">
          <SupportCoinsBackground />
          <CardContent className="relative flex min-h-60 flex-col gap-5 sm:min-h-72">
            <div className="flex items-center gap-3">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-background/5"><Gift className="size-5" aria-hidden="true" /></div>
              <div><p className="font-medium">Подарок от PulsarWeb</p><p className="text-xs text-background/65">Включён в разработку</p></div>
            </div>
            <Separator className="bg-background/15" />
            <div className="flex flex-1 items-center py-6">
              <p className="flex items-baseline gap-3">
                <span className="text-[7rem] leading-none font-medium tracking-tighter sm:text-[8rem]">2</span>
                <span className="text-2xl tracking-tight">месяца</span>
              </p>
            </div>
          </CardContent>
          <CardHeader className="relative content-start gap-3">
            <CardTitle><h3 className="text-2xl tracking-tight sm:text-3xl">Поддержки после запуска</h3></CardTitle>
            <CardDescription className="text-base leading-relaxed text-background/65">Отвечаем на вопросы по сайту и исправляем технические ошибки.</CardDescription>
          </CardHeader>
          <CardFooter className="relative"><ButtonLink href="/start" className="w-full sm:w-auto">Обсудить проект</ButtonLink></CardFooter>
        </Card>
        <Card className="marketing-surface gap-8 lg:row-span-3 lg:grid lg:grid-rows-subgrid ring-0 [--card-spacing:--spacing(8)] sm:[--card-spacing:--spacing(10)] lg:col-span-3">
          <CardContent className="flex min-h-60 flex-col gap-5 sm:min-h-72">
            <div className="flex items-center gap-3">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-secondary"><MessageCircle className="size-5" aria-hidden="true" /></div>
              <div><p className="font-medium">Ваш разработчик</p><p className="text-xs text-muted-foreground">PulsarWeb</p></div>
            </div>
            <Separator />
            <SupportConversation>
              <p className="max-w-[90%] self-end rounded-2xl rounded-br-sm bg-foreground px-4 py-3 text-background">Сайт уже запущен. А если появятся вопросы?</p>
              <p className="max-w-[90%] rounded-2xl rounded-bl-sm bg-accent px-4 py-3 text-accent-foreground">Напишите нам — поможем разобраться.</p>
              <p className="max-w-[90%] self-end rounded-2xl rounded-br-sm bg-foreground px-4 py-3 text-background">Можно будет обновить контент?</p>
              <p className="max-w-[90%] rounded-2xl rounded-bl-sm bg-accent px-4 py-3 text-accent-foreground">Да, обсудим изменения и согласуем объём работ.</p>
            </SupportConversation>
          </CardContent>
          <CardHeader className="content-start gap-3">
            <CardTitle><h3 className="text-2xl tracking-tight sm:text-3xl">Напрямую с разработчиком</h3></CardTitle>
            <CardDescription className="max-w-lg text-base leading-relaxed">На связи тот, кто создал ваш сайт. Знаем проект изнутри и поможем с дальнейшими шагами.</CardDescription>
          </CardHeader>
          <CardFooter><ButtonLink href={getTelegramOwnerContact().url} variant="outline" className="w-full sm:w-auto"><Send data-icon="inline-start" aria-hidden="true" />Написать в Telegram</ButtonLink></CardFooter>
        </Card>
      </div>
    </Section>
  )
}

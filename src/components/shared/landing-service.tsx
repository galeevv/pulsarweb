import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Section } from "@/components/layout/section"

export function LandingService() {
  return (
    <Section className="pt-6 md:pt-10">
      <Card className="gap-6 rounded-3xl bg-muted pt-0 ring-0 sm:rounded-[2rem]">
        <div className="relative aspect-[21/9] overflow-hidden rounded-3xl sm:rounded-[2rem]">
          <Image
            src="/images/services/landing-form-wide.webp"
            alt="Концепт лендинга FORM на ноутбуке"
            fill
            unoptimized
            className="object-cover"
            preload
          />
        </div>
        <CardHeader className="gap-4">
          <CardTitle>
            <h1 className="home-section-title">Лендинги под рекламу</h1>
          </CardTitle>
          <CardDescription className="max-w-2xl text-base leading-relaxed sm:text-lg">
            От вашего предложения — к первым заявкам. Создадим сайт и подготовим
            к запуску рекламы.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {[
            "2 месяца сопровождения бесплатно",
            "Адаптивный дизайн",
            "Метрика и цели",
          ].map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="h-auto min-h-7 max-w-full px-3 py-1 text-left whitespace-normal"
            >
              {tag}
            </Badge>
          ))}
        </CardContent>
      </Card>
    </Section>
  )
}

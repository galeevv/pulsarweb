import { Section } from "@/components/layout/section"

export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: string
  description?: string
}) {
  return (
    <Section className="pt-20 pb-12 md:pt-28 md:pb-16">
      <p className="eyebrow mb-8">{eyebrow}</p>
      <h1 className="max-w-5xl text-4xl leading-[1.06] font-medium tracking-[-0.055em] sm:text-6xl lg:text-7xl">
        {title}
      </h1>
      {description && (
        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}
    </Section>
  )
}

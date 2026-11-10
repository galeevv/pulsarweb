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
    <Section className="pt-12 pb-10 md:pt-20 md:pb-14">
      <p className="eyebrow mb-8">{eyebrow}</p>
      <h1 className="max-w-[18ch] text-4xl leading-[1.06] font-medium tracking-[-0.055em] sm:text-6xl lg:text-7xl">
        {title}
      </h1>
      {description && (
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
          {description}
        </p>
      )}
    </Section>
  )
}

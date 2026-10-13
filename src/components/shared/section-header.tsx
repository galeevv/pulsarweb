type SectionHeaderProps = {
  eyebrow: string
  title: string
  description?: string
}

export function SectionHeader({
  eyebrow,
  title,
  description,
}: SectionHeaderProps) {
  return (
    <div className="mb-12 flex max-w-3xl flex-col gap-5 md:mb-16">
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="text-3xl leading-[1.12] font-medium tracking-[-0.045em] sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {description && (
        <p className="max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
          {description}
        </p>
      )}
    </div>
  )
}

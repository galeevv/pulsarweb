import type { ComponentProps } from "react"
import { Container } from "@/components/layout/container"
import { cn } from "@/lib/utils"

export function Section({
  children,
  className,
  ...props
}: ComponentProps<"section">) {
  return (
    <section className={cn("py-20 md:py-28", className)} {...props}>
      <Container>{children}</Container>
    </section>
  )
}

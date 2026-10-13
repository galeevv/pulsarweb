import Link from "next/link"
import type { ComponentProps } from "react"
import type { VariantProps } from "class-variance-authority"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function ButtonLink({
  variant,
  size = "lg",
  className,
  ...props
}: ComponentProps<typeof Link> & VariantProps<typeof buttonVariants>) {
  return (
    <Link
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), "min-h-11", className)}
      {...props}
    />
  )
}

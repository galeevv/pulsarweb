import type { ComponentProps } from "react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export function HomeBadge({
  className,
  large = false,
  ...props
}: Omit<ComponentProps<typeof Badge>, "variant"> & { large?: boolean }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "h-auto min-h-7 max-w-full bg-secondary px-3 py-1 whitespace-normal",
        large && "min-h-9 px-4 text-sm",
        className
      )}
      {...props}
    />
  )
}

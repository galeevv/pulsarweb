import type { ComponentProps } from "react"
import { cn } from "@/lib/utils"

export function Container({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-7xl px-6 sm:px-10 lg:px-16",
        className
      )}
      {...props}
    />
  )
}

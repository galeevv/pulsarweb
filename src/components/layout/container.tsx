import type { ComponentProps } from "react"
import { cn } from "@/lib/utils"

export function Container({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[1400px] px-3 min-[681px]:px-8",
        className
      )}
      {...props}
    />
  )
}

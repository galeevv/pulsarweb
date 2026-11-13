"use client"

import { usePathname } from "next/navigation"
import type { ReactNode } from "react"

export function FooterVisibility({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  return ["/start", "/contacts", "/about", "/services", "/projects"].includes(
    pathname
  )
    ? null
    : children
}

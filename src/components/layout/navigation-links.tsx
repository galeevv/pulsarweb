"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { navigation } from "@/config/navigation"
import { cn } from "@/lib/utils"

export function NavigationLinks({
  mobile = false,
  onNavigate,
}: {
  mobile?: boolean
  onNavigate?: () => void
}) {
  const pathname = usePathname()
  return navigation.map(({ label, href, icon: Icon }) => {
    const active = pathname === href || pathname.startsWith(`${href}/`)
    return (
      <Link
        key={href}
        href={href}
        onClick={onNavigate}
        aria-current={
          pathname === href ? "page" : active ? "location" : undefined
        }
        className={cn(
          "inline-flex min-h-11 items-center gap-2.5 rounded-sm transition-colors hover:text-foreground",
          active ? "text-foreground" : "text-muted-foreground",
          mobile ? "gap-4 py-2 text-2xl tracking-tight" : "text-sm"
        )}
      >
        <Icon
          className={cn("shrink-0", mobile ? "size-5" : "size-4")}
          aria-hidden="true"
        />
        {label}
      </Link>
    )
  })
}

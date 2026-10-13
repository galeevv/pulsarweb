"use client"

import { useState } from "react"
import { Menu, ArrowUpRight } from "lucide-react"
import { site } from "@/config/site"
import { NavigationLinks } from "@/components/layout/navigation-links"
import { Button } from "@/components/ui/button"
import { ButtonLink } from "@/components/shared/button-link"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export function MobileNavigation() {
  const [open, setOpen] = useState(false)
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon-lg"
            className="size-11"
            aria-label="Открыть меню"
          />
        }
      >
        <Menu />
      </SheetTrigger>
      <SheetContent
        className="w-full max-w-sm overflow-y-auto"
        closeLabel="Закрыть меню"
      >
        <SheetHeader>
          <SheetTitle>Навигация</SheetTitle>
          <SheetDescription>{site.tagline}</SheetDescription>
        </SheetHeader>
        <nav
          aria-label="Мобильная навигация"
          className="flex flex-col gap-6 px-6 py-8"
        >
          <NavigationLinks mobile onNavigate={() => setOpen(false)} />
          <ButtonLink
            href="/contacts"
            onClick={() => setOpen(false)}
            className="mt-6 h-12"
          >
            Обсудить проект
            <ArrowUpRight data-icon="inline-end" />
          </ButtonLink>
        </nav>
      </SheetContent>
    </Sheet>
  )
}

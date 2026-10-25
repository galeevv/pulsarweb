"use client"

import { useState } from "react"
import { Menu, ArrowUpRight, X } from "lucide-react"
import { NavigationLinks } from "@/components/layout/navigation-links"
import { Button } from "@/components/ui/button"
import { ButtonLink } from "@/components/shared/button-link"
import {
  Sheet,
  SheetContent,
  SheetClose,
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
        showCloseButton={false}
      >
        <SheetHeader className="flex-row items-center justify-between gap-4 px-6 pt-6 pb-6">
          <SheetTitle className="text-2xl tracking-tight">Навигация</SheetTitle>
          <SheetClose
            render={
              <Button
                variant="ghost"
                size="icon-lg"
                className="size-11"
                aria-label="Закрыть меню"
              />
            }
          >
            <X className="size-5" aria-hidden="true" />
          </SheetClose>
        </SheetHeader>
        <nav
          aria-label="Мобильная навигация"
          className="flex flex-col gap-6 px-6 pt-2 pb-8"
        >
          <NavigationLinks mobile onNavigate={() => setOpen(false)} />
          <ButtonLink
            href="/start"
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

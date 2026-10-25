import Link from "next/link"
import { Container } from "@/components/layout/container"
import { Logo } from "@/components/shared/logo"
import { legalNavigation } from "@/config/navigation"
import { site } from "@/config/site"
import { Separator } from "@/components/ui/separator"
import { getTelegramOwnerContact } from "@/lib/env/server"

export function SiteFooter() {
  return (
    <footer className="bg-muted/30 py-6">
      <Container>
        <div className="glass-panel px-6 py-5 sm:py-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Logo />
            <nav
              aria-label="Связаться с нами"
              className="flex flex-wrap items-center gap-x-6 gap-y-3"
            >
              <Link
                href={getTelegramOwnerContact().url}
                className="inline-flex min-h-11 items-center rounded-sm text-sm text-muted-foreground hover:text-foreground"
              >
                Telegram
              </Link>
              <Link
                href="/contacts"
                title="Адрес почты скоро появится"
                className="inline-flex min-h-11 items-center rounded-sm text-sm text-muted-foreground hover:text-foreground"
              >
                Почта
              </Link>
            </nav>
          </div>
          <Separator className="my-4" />
          <div className="flex flex-col justify-between gap-3 text-xs text-muted-foreground md:flex-row md:items-center">
            <p>
              © {new Date().getFullYear()} {site.name}
            </p>
            <nav
              aria-label="Юридическая информация"
              className="flex flex-wrap gap-x-6 gap-y-3"
            >
              {legalNavigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="inline-flex min-h-11 items-center rounded-sm hover:text-foreground"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </Container>
    </footer>
  )
}

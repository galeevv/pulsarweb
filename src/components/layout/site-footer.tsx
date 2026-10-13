import Link from "next/link"
import { Container } from "@/components/layout/container"
import { Logo } from "@/components/shared/logo"
import { navigation, legalNavigation } from "@/config/navigation"
import { site } from "@/config/site"
import { Separator } from "@/components/ui/separator"

export function SiteFooter() {
  return (
    <footer className="bg-muted/30 px-4 py-6 sm:px-6">
      <Container className="glass-panel py-8 sm:py-10">
        <div className="flex flex-col justify-between gap-10 md:flex-row">
          <div className="flex flex-col gap-4">
            <Logo />
            <p className="max-w-lg text-sm leading-relaxed text-muted-foreground">
              PulsarWeb — небольшая студия разработки цифровых решений для
              бизнеса.
            </p>
          </div>
          <nav
            aria-label="Навигация в подвале"
            className="grid grid-cols-2 gap-x-10 gap-y-4 text-sm"
          >
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="inline-flex min-h-11 items-center rounded-sm transition-colors hover:text-muted-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <Separator className="my-10" />
        <div className="flex flex-col justify-between gap-6 text-xs text-muted-foreground md:flex-row md:items-center">
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
      </Container>
    </footer>
  )
}
